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
import {PClassIController} from './pclass-instance.controller';
import {
    DStorageType,
    EthPMPackageJson,
    PackageMeta,
    ContractType
} from '../interfaces';

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
    @requestBody() ppackage: Package,
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
    let dstorage, ppackage;
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
    return await this.packageRepository.create(ppackage);
  }

  @get('/package/deconstruct/{id}', {
    responses: {
      '200': {
        description: 'Package model instance',
        // content: {'application/json': {schema: {'x-ts-type': Package}}},
      },
    },
  })
  async deconstructPackage(
    @param.path.string('id') id: string,
): Promise<any> {
    let ppackage: Package, package_update: object;
    let package_json: EthPMPackageJson;
    // let contracts: string[] = [];
    let contracts: object[] = [];
    let deployments: object[] = [], modules: string[] = [];
    let sources: any[] = [];

    let pclassController = new PClassController(await this.packageRepository.pclass);
    let pclassiController = new PClassIController(await this.packageRepository.pclassi);

    ppackage = await this.findById(id);
    if (!ppackage) throw new HttpErrors.NotFound('Game not found');
    if (ppackage.package) {
        // TODO return pclasses, deployments and pfunctions
        return ppackage;
    }
    package_json = JSON.parse(ppackage.package_json);

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
            ))[0];
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

    await Object.entries(package_json.contract_types).map(async (entry: any) => {
        let contract_alias: string = entry[0];
        let contractType: ContractType = entry[1];
        // console.log(contract_alias, contractType);
        let pclass;
        pclass = {
            name: contract_alias,
            packageid: ppackage._id,
            // module: ,
            type: 'sol',
            pclass: {
                gapi: contractType.abi,
                natspec: contractType.natspec,
                sources,
                // flatsource: ,
                // flatsource_hash: ,
                name: contractType.contract_name,
                deployment_bytecode: contractType.deployment_bytecode,
                runtime_bytecode: contractType.runtime_bytecode,
                // metadata: , // ?
                compiler: contractType.compiler,
            },
            // tags: ,
            // chainids: ,
        }

        // contracts.push((await pclassController.createFunctions(pclass))._id);
        contracts.push(pclass);
    });

    // Object.entries(package_json.deployments).map((chain_id, Deployment) => {
    //     console.log(entry, key);
    //     let pclassi, deployment;
    //     pclassi = {
    //
    //     }
    //
    //     deployment = {
    //         chain_id: ,
    //         genesis_hash: ,
    //         block_hash: ,
    //         bip122_uri: ,
    //         instanceid: (await pclassiController.create(pclassi))._id,
    //     }
    //     deployments.push(deployment);
    // }

    package_update = {
        // lockfile_version is for backwards compatibility
        manifest_version: package_json.manifest_version,
        package_name: package_json.package_name,
        version: package_json.version,
        meta: package_json.meta,
        contracts,
        deployments,
    }

    return [package_update, modules];

    // return this.updateById(ppackage._id, {
    //     package,
    //     modules,
    // });
  }
}
