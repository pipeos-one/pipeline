import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  FilterBuilder,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Package, DStorage} from '../models';
import {PackageRepository} from '../repositories';
import {DStorageController} from './dstorage.controller';
import {PClassController} from './pclass.controller';
import {PClassIController} from './pclassi.controller';
import {
    DStorageType,
    EthPMPackageJson,
    PackageMeta,
    ContractType,
    ContractInstance,
} from '../interfaces';
import {bip122UriToChainId, BIP122_TO_CHAINID} from '../utils/chain';
import {pipeToEthpm} from '../utils/ethpm';

export class PackageController {
  constructor(
    @repository(PackageRepository)
    public packageRepository : PackageRepository,
  ) {}

  @post('/package', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: {'x-ts-type': Package}}},
      },
    },
  })
  async create(@requestBody() ppackage: Package): Promise<Package> {
    return await this.packageRepository.create(ppackage);
  }

  @post('/package/init', {
    responses: {
      '200': {
        description: 'Package model instance',
        // content: {'application/json': {schema: {'x-ts-type': <Partial>Package}}},
      },
    },
  })
  async initPackage(@requestBody() ppackage: Package): Promise<any> {
    let pclasses, pclassiIds = [], ppackageNew;

    let pclassController = new PClassController(await this.packageRepository.pclass);
    let pclassiController = new PClassIController(await this.packageRepository.pclassi);

    if (!ppackage.package) {
        throw new HttpErrors.BadRequest('No EthPM package description provided');
    }

    if (!ppackage.package.contracts) {
        throw new HttpErrors.BadRequest('No contract ids were provided for the package');
    }

    pclasses = await pclassController.find({where: {_id: {inq: ppackage.package.contracts}}});

    if (pclasses.length === 0) {
        throw new HttpErrors.BadRequest('PClasses not found.');
    }

    for (let i = 0; i < pclasses.length; i++) {
        let pclass = pclasses[i];
        let pclassi;

        if (pclass.packageid) {
            throw new HttpErrors.BadRequest(`Contract instance ${pclass.name} is already included in another package. Insert the contract as a new instance.`);
        }

        pclassi = (await pclassiController.find({where: {pclassid: {inq: [pclass._id]}}}))[0];

        if (pclassi) {
            if (pclassi.packageid) {
                throw new HttpErrors.BadRequest(`Contract deployment instance ${pclass.name} is already included in another package. Insert the contract as a new instance.`);
            }
            pclassiIds.push(pclassi._id);
        }
    };
    ppackage.package.manifest_version = '2';
    ppackage.package.deployments = pclassiIds;

    ppackageNew = await this.packageRepository.create(ppackage, {strictObjectIDCoercion: true});
    console.log('ppackageNew', ppackageNew);
    let package_id: string = String(ppackageNew._id.valueOf());
    await pclassController.pclassRepository.updateAll(
        {packageid: package_id},
        {_id: {inq: ppackage.package.contracts}},
        {strictObjectIDCoercion: true},
    );
    for (let i = 0; i < ppackage.package.contracts.length; i++) {
        let pclassid = ppackage.package.contracts[i];
        let tags = (await pclassController.findById(pclassid)).tags;
        await pclassController.updateById(
            pclassid,
            {tags: tags.concat(['ethpm', ppackage.package.package_name])},
        );
    };
    await pclassiController.pclassIRepository.updateAll(
        {packageid: package_id},
        {_id: {inq: pclassiIds}},
        {strictObjectIDCoercion: true},
    );

    return await this.exportToEthpm(package_id);
    // TODO: modules
    // TODO: storage, json
    // TODO: contracts & deployments ids: ObjectID (import) vs. string (this)
  }

  @get('/package/count', {
    responses: {
      '200': {
        description: 'Package model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Package)) where?: Where,
  ): Promise<Count> {
    return await this.packageRepository.count(where);
  }

  @get('/package', {
    responses: {
      '200': {
        description: 'Array of Package model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Package}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Package)) filter?: Filter,
  ): Promise<Package[]> {
    return await this.packageRepository.find(filter);
  }

  @patch('/package', {
    responses: {
      '200': {
        description: 'Package PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() ppackage: Package,
    @param.query.object('where', getWhereSchemaFor(Package)) where?: Where,
  ): Promise<Count> {
    return await this.packageRepository.updateAll(ppackage, where);
  }

  @get('/package/{id}', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: {'x-ts-type': Package}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Package> {
    return await this.packageRepository.findById(id);
  }

  @patch('/package/{id}', {
    responses: {
      '204': {
        description: 'Package PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() ppackage: Partial<Package>,
  ): Promise<void> {
    await this.packageRepository.updateById(id, ppackage);
  }

  @put('/package/{id}', {
    responses: {
      '204': {
        description: 'Package PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ppackage: Package,
  ): Promise<void> {
    await this.packageRepository.replaceById(id, ppackage);
  }

  @del('/package/{id}', {
    responses: {
      '204': {
        description: 'Package DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.packageRepository.deleteById(id);
  }

  @del('/package/{id}/all', {
    responses: {
        '200': {
            description: 'Package, PClass, PClassI, PFunction DELETE success count',
            content: {'application/json': {schema: CountSchema}},
        },
    },
  })
  async deleteEntirePackageComponents(@param.path.string('id') id: string): Promise<any> {
    let ppackage, pclasses, count: Count = {count: 0};
    let pclassController = new PClassController(await this.packageRepository.pclass);

    ppackage = await this.findById(id);

    pclasses = await pclassController.find({where: {packageid: id}});
    for (let i = 0; i < pclasses.length; i++) {
        count.count += (await pclassController.deletePClassFunctions(pclasses[i]._id)).count;
    };
    await this.deleteById(id);
    return count;
  }

  @get('/package/storage/{type}/{hash}', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: {'x-ts-type': Package}}},
      },
    },
  })
  async tryInsertFromStorage(
    @param.path.string('type') type: DStorageType,
    @param.path.string('hash') hash: string,
  ): Promise<Package> {
    let ppackage;

    ppackage = await this.packageRepository.find(
        JSON.parse(JSON.stringify({ where: {
            'storage.hash': hash,
            'storage.type': type
        }}))
    );

    if (ppackage.length > 0) {
        return ppackage[0];
    }
    return await this.insertFromStorage(type, hash);
  }

  async insertFromStorage(type: DStorageType, hash: string): Promise<Package> {
    let dstorage, ppackage, newPackage;
    let json: any, package_json: EthPMPackageJson;

    dstorage = new DStorageController();

    json = (await dstorage.get(type, hash))[0];
    if (!json) {
        throw new HttpErrors.NotFound('Package.json not found');
    }

    // Support for older versions
    if (!json.manifest_version) {
        json.manifest_version = json.lockfile_version;
    }

    package_json = json;
    if (!package_json.manifest_version) {
        throw new HttpErrors.InternalServerError('No manifest_version was found in package.json');
    }

    ppackage = {
        package_json: JSON.stringify(package_json),
        storage: {type, hash},
    };
    newPackage = await this.packageRepository.create(ppackage);
    return await this.importFromEthpm(newPackage._id);
  }

  @get('/package/import/{id}', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: {'x-ts-type': Package}}},
      },
    },
  })
  async importFromEthpm(
    @param.path.string('id') id: string,
): Promise<any> {
    let ppackage: Package, package_update: any;
    let package_json: EthPMPackageJson;
    let pclassIds: any = {};
    let deployments: any[] = [], modules: string[] = [];
    let sources: any[] = [];
    let tags: string[] = [];

    let pclassController = new PClassController(await this.packageRepository.pclass);
    let pclassiController = new PClassIController(await this.packageRepository.pclassi);

    ppackage = await this.findById(id);
    if (!ppackage) throw new HttpErrors.NotFound('Game not found');
    if (ppackage.package) {
        // TODO return pclasses, deployments and pfunctions
        return ppackage;
    }
    package_json = JSON.parse(ppackage.package_json);

    tags.push(package_json.package_name);
    tags.push('ethpm');
    if (package_json.meta && package_json.meta.keywords) {
        tags = tags.concat(package_json.meta.keywords);
    }

    sources = await Promise.all(Object.entries(package_json.sources).map(async (entry: any): Promise<number> => {
        let relative_path: string = entry[0];
        let source: string = entry[1];
        let source_entry: any, source_string: string, dstorage_link: any;
        let dstorage;

        source_entry = {relative_path};
        dstorage_link = source.match(/^(ipfs|bzz)/g);

        if (dstorage_link) {
            source_entry.storage = {
                type: dstorage_link[0],
                hash: source.replace(/^(ipfs|bzz):\/\//g, ''),
            }
            dstorage = new DStorageController();

            source_string = (await dstorage.get(
                source_entry.storage.type,
                source_entry.storage.hash,
            ).catch((error) => { throw(error) }))[0];
            if (!source_string) {
                throw new HttpErrors.NotFound(`Source for ${source} not found`);
            }
            source_entry.source = source_string;
        }

        if (!source_entry.source) {
            source_entry.source = source;
        }
        return source_entry;
    }));

    modules = Object.keys(package_json.sources).map((key: string) => {
        return key.replace(/\/(?:.(?!\/))+$/, '').replace(/^\.\//, '');
    }).filter((v, i, a) => a.indexOf(v) === i);

    await Promise.all(Object.entries(package_json.contract_types).map(async (entry: any): Promise<void> => {
        let contract_alias: string = entry[0];
        let contractType: ContractType = entry[1];
        let pclass: any, pclassId: string;
        let chainids: string[] = [];
        let compiler: any;

        // We go with solc compiler format:
        // http://solidity.readthedocs.io/en/latest/using-the-compiler.html#compiler-input-and-output-json-description
        // EthPM schema only has compiler.settings = {optimize: boolean}
        compiler = contractType.compiler;
        if (compiler && compiler.settings) {
            if (!compiler.settings.optimizer) {
                compiler.settings.optimizer = {
                    enabled: compiler.settings.optimize,
                    runs: compiler.settings.runs,
                };
            }
        }

        Object.entries(package_json.deployments).map((entry: any) => {
            let bip122_uri: string = entry[0];
            let chain_id = bip122UriToChainId(bip122_uri);

            if (entry[1][contract_alias]) {
                chainids.push(BIP122_TO_CHAINID[chain_id[0]]);
            }
        });

        pclass = {
            name: contract_alias || contractType.contract_name,
            packageid: ppackage._id,
            // module: ,
            type: 'sol',
            pclass: {
                gapi: contractType.abi,
                natspec: contractType.natspec,
                sources,
                // flatsource: ,
                // flatsource_hash: ,
                name: contractType.contract_name || contract_alias,
                deployment_bytecode: contractType.deployment_bytecode,
                runtime_bytecode: contractType.runtime_bytecode,
                // metadata: , // ?
                compiler,
            },
            tags,
            chainids,
        }
        pclassId = (
            await pclassController.createFunctions(pclass)
        )._id;

        pclassIds[pclass.name] = pclassId;
    }));

    await Promise.all(Object.entries(package_json.deployments).map(async (entry: any): Promise<void> => {
        let bip122_uri: string = entry[0];

        await Promise.all(Object.entries(entry[1]).map(async (entry2: any): Promise<void> => {
            let contract_instance_name: string = entry2[0];
            let ethpm_deployment: ContractInstance = entry2[1];
            let pclassi, chain_id: string[], compiler;
            let deploymentId: string;

            chain_id = bip122UriToChainId(bip122_uri);

            pclassi = {
                packageid: ppackage._id,
                pclassid: pclassIds[ethpm_deployment.contract_type],
                pclassi: {
                    instance_name: contract_instance_name,
                    address: ethpm_deployment.address,
                    transaction: ethpm_deployment.transaction,
                    block: ethpm_deployment.block,
                    runtime_bytecode: ethpm_deployment.runtime_bytecode,
                    deployment_bytecode: ethpm_deployment.deployment_bytecode,
                    // constructorArgs,
                    compiler: ethpm_deployment.compiler,
                    chain_id: BIP122_TO_CHAINID[chain_id[0]],
                    genesis_hash: chain_id[0],
                    block_hash: chain_id[2],
                    bip122_uri: bip122_uri,
                }
            }

            deploymentId = (
                await pclassiController.pclassIRepository.create(pclassi)
            )._id;
            deployments.push(deploymentId);
        }));
    }));

    // TODO build_dependencies

    package_update = {
        manifest_version: package_json.manifest_version,
        package_name: package_json.package_name,
        version: package_json.version,
        meta: package_json.meta,
        contracts: Object.values(pclassIds),
        deployments,
        // build_dependencies,
    }

    await this.updateById(ppackage._id, {
        package: package_update,
        modules,
    });
    return await this.findById(ppackage._id);
  }

  @get('/package/export/{id}', {
    responses: {
      '200': {
        description: 'Package model instance',
        // content: {'application/json': {schema: {'x-ts-type': Package}}},
      },
    },
  })
  async exportToEthpm(
    @param.path.string('id') id: string,
): Promise<any> {
    let ppackage, pclasses, pclassii, dstorage;
    let package_json: EthPMPackageJson;

    let pclassController = new PClassController(await this.packageRepository.pclass);
    let pclassiController = new PClassIController(await this.packageRepository.pclassi);

    ppackage = await this.findById(id);
    pclasses = await pclassController.pclassRepository.find({where: {packageid: id}}, {strictObjectIDCoercion: true});
    pclassii = await pclassiController.pclassIRepository.find({where: {packageid: id}}, {strictObjectIDCoercion: true});


    package_json = pipeToEthpm(ppackage.package, pclasses, pclassii);
    if (!package_json) {
        throw new HttpErrors.InternalServerError('Package json could not be created');
    }
    console.log('package_json', package_json);
    let package_json_str = JSON.stringify(package_json);

    dstorage = new DStorageController();
    let hash: string = (await dstorage.post('swarm', package_json_str))[0];
    console.log('hash', hash);
    if (!hash) {
        throw new HttpErrors.InternalServerError('Could not upload to swarm');
    }

    await this.packageRepository.updateById(id, {
        package_json: package_json_str,
        storage: {
            type: (<DStorageType>'swarm'),
            hash: hash,
        },
    });
    return {
        package_json: package_json_str,
        storage: {
            type: (<DStorageType>'swarm'),
            hash: hash,
        },
    };
  }
}
