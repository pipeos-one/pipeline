import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {PClass, SolClass, PFunction, PClassI, SolInstance} from '../models';
import {PClassRepository} from '../repositories';
import {PFunctionController, PClassIController} from '../controllers';
import {AbiFunctionInput, AbiFunctionOuput, AbiFunction} from '../interfaces/gapi';
import {Natspec, EMPTY_NATSPEC} from '../interfaces/natspec';
import {GetPClassFunctionsPClassI} from '../interfaces';

let solc = require('solc');

export class PClassController {
  constructor(
    @repository(PClassRepository)
    public pclassRepository : PClassRepository,
  ) {}

  @post('/pclass', {
    responses: {
      '200': {
        description: 'PClass model instance',
        content: {'application/json': {'x-ts-type': PClass}},
      },
    },
  })
  async create(@requestBody() pclass: PClass): Promise<PClass> {
    return await this.pclassRepository.create(pclass);
  }

  @get('/pclass/count', {
    responses: {
      '200': {
        description: 'PClass model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PClass)) where?: Where,
  ): Promise<Count> {
    return await this.pclassRepository.count(where);
  }

  @get('/pclass', {
    responses: {
      '200': {
        description: 'Array of PClass model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': PClass}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(PClass)) filter?: Filter,
  ): Promise<PClass[]> {
    return await this.pclassRepository.find(filter);
  }

  @patch('/pclass', {
    responses: {
      '200': {
        description: 'PClass PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() pclass: Partial<PClass>,
    @param.query.object('where', getWhereSchemaFor(PClass)) where?: Where,
  ): Promise<Count> {
    return await this.pclassRepository.updateAll(pclass, where);
  }

  @get('/pclass/{id}', {
    responses: {
      '200': {
        description: 'PClass model instance',
        content: {'application/json': {'x-ts-type': PClass}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<PClass> {
    return await this.pclassRepository.findById(id);
  }

  @get('/pclass/{id}/js', {
    responses: {
      '200': {
        description: 'PClass JS script',
        content: {'application/javascript': {'x-ts-type': PClass}},
      },
    },
  })
  async getJSById(@param.path.string('id') id: string): Promise<string> {
    const pclass = await this.pclassRepository.findById(id);
    return (<SolClass>pclass.pclass).flatsource || '';
  }

  @patch('/pclass/{id}', {
    responses: {
      '204': {
        description: 'PClass PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() pclass: Partial<PClass>,
  ): Promise<void> {
    await this.pclassRepository.updateById(id, pclass);
  }

  @del('/pclass/{id}', {
    responses: {
      '204': {
        description: 'PClass DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pclassRepository.deleteById(id);
  }

  @get('/pclass/pfunctions')
  async findPClassFunctionsPClassI(
      @param.query.object('filter', getFilterSchemaFor(PClass)) filter?: Filter,
  ): Promise<GetPClassFunctionsPClassI> {
    let functions_filter, pclassi_queries: any[], pclassi_filter, classids;
    let pclasses, pclassii, pfunctions;

    let pfunctionRepository = await this.pclassRepository.pfunctions;
    let pclassiRepository = await this.pclassRepository.pclassi;

    pclasses = await this.pclassRepository.find(filter);

    // PFunction filter
    classids = pclasses.map(pclass => {
        return {"classid": {"like": pclass._id}};
    });
    if (classids.length == 0) {
        classids = [{"classid": {"like": "xxxxxx"}}];
    }
    functions_filter = JSON.parse(JSON.stringify({where: {or: classids}}));

    // PClassI filter
    pclassi_queries = [];
    if (filter && filter.where && filter.where.chainids) {
        pclassi_queries.push({or: filter.where.chainids.inq.map((chainid: string) => {
            return {'instance.chainid': chainid}
        })});
    }
    pclassi_filter = JSON.parse(JSON.stringify({where: {and:
        [functions_filter.where].concat(pclassi_queries),
    }}));

    pfunctions = await pfunctionRepository.find(functions_filter);
    pclassii = await pclassiRepository.find(pclassi_filter);

    return {pclasses, pclassii, pfunctions};
  }

  // Additional routes
  @post('/pclass/pfunctions')
  async createFunctions(
    @requestBody() pclass: PClass,
  ): Promise<PClass> {
    // For a Solidity smart contract, if we only have the source, we try to compile it
    // so we can store the abi, natspec
    pclass.pclass = this.tryCompileSolClass(
        pclass.name,
        (<SolClass>pclass.pclass)
    );
    if (!pclass.pclass) {
        throw new HttpErrors.InternalServerError('PClass instance does not contain pclass');
    }

    let newPclass = await this.create(pclass);

    this.createFunctionsFromPClass(newPclass).catch((e: Error) => {
        console.log('createFunctionsFromPClass', e);
        this.deletePClassFunctions(newPclass._id);
        return this.deleteById(newPclass._id);
    });
    return newPclass;
  }

  @post('/pclass/pclassi', {
    responses: {
      '200': {
        description: 'PClassI model instance',
        content: {'application/json': {'x-ts-type': PClassI}},
      },
    },
  })
  async addPClassI(
      @requestBody() pclassi: PClassI,
  ): Promise<PClassI> {
    let pclassiRepository = await this.pclassRepository.pclassi;
    let pclass = await this.findById(pclassi.classid);

    pclass.chainids = pclass.chainids || [];
    if (!pclass.chainids.includes((<SolInstance>pclassi.instance).chainid)) {
        pclass.chainids.push((<SolInstance>pclassi.instance).chainid);
        await this.updateById(pclassi.classid, {chainids: pclass.chainids});
    }
    return await pclassiRepository.create(pclassi);
  }

  @post('/pclass/{id}/pfunctions')
  async createFunctionsFromPClass(
    @requestBody() pclass: PClass,
): Promise<PClass | void> {
    let gapi: AbiFunction[], natspec: Natspec;
    let emptydoc = {methods: {}};

    gapi = pclass.pclass.gapi || [];
    natspec = pclass.pclass.natspec || emptydoc;

    for (let i=0; i < gapi.length; i++) {
        let funcapi: AbiFunction = gapi[i];
        let signature, functiondoc;

        if (funcapi.inputs) {
            signature = funcapi.inputs.map((input: AbiFunctionInput) => input.type).join(',');
        }
        signature = funcapi.name ? `${funcapi.name}(${signature})` : undefined;
        functiondoc = {
            pfunction: {
                signature,
                gapi: funcapi,
                natspec: signature ? natspec.methods[signature] : undefined,
                chainids: pclass.chainids,
            },
            uri: pclass.uri,
            tags: pclass.tags,
            timestamp: pclass.timestamp,
        }
        let pfunction = await this.pclassRepository.functions(pclass._id).create(functiondoc);

        if (!this.pclassRepository.functions(pclass._id).find({where: {_id: pfunction._id}})) {
            throw new Error(`Function ${functiondoc.pfunction.gapi}was not created.`)
        };
    };
    return;
  }

  @del('/pclass/{id}/pfunctions', {
    responses: {
      '200': {
        description: 'PClass.PFunction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async deletePClassFunctions(
    @param.path.string('id') id: string,
    // @param.query.object('where', getWhereSchemaFor(PFunction)) where?: Where,
  ): Promise<Count> {
    let pfunctionRepository = await this.pclassRepository.pfunctions;
    let pfunctionController = new PFunctionController(pfunctionRepository);

    let pclassiRepository = await this.pclassRepository.pclassi;
    let pclassiController = new PClassIController(pclassiRepository);

    await this.pclassRepository.deleteById(id);
    await pclassiController.delete({classid: {like: id}});
    return await pfunctionController.delete({classid: {like: id}});

    // return await this.pclassRepository.functions(id).delete();
  }

    tryCompileSolClass(contractName: string, pclass: SolClass): any {
        let compiled, metadata;
        if (!pclass.natspec && (pclass.devdoc || pclass.userdoc)) {
            pclass.natspec = this.getNatspec(pclass.devdoc, pclass.userdoc);
        }
        if (pclass.flatsource && (!pclass.gapi || !pclass.natspec)) {
            compiled = this.compile(pclass.flatsource);
            if (compiled.contracts[`:${contractName}`]) {
                try {
                    metadata = JSON.parse(compiled.contracts[`:${contractName}`].metadata)
                    pclass.gapi = pclass.gapi || metadata.output.abi;
                    pclass.natspec = this.getNatspec(
                        pclass.devdoc || metadata.output.devdoc,
                        pclass.userdoc || metadata.output.userdoc
                    );
                } catch {
                    console.log('Metadata could not be parsed: ', compiled.contracts[`:${contractName}`].metadata);
                }
            } else if (compiled.errors[0].includes('ParserError: Expected pragma')) {
                pclass.flatsource = '// No source code available.';
            }
        }
        if (pclass.flatsource && !pclass.gapi) {
            console.log(contractName + ' not inserted.');
            return;
        }
        delete pclass.devdoc;
        delete pclass.userdoc;

        return pclass;
    }

    compile(source: string): any {
        try {
            const compiled = solc.compile(source, 0);
            return compiled;
        }
        catch {
            console.log('Compilation failed.');
            return null;
        }
    }

    getNatspec(devdoc: Natspec = EMPTY_NATSPEC, userdoc: Natspec = EMPTY_NATSPEC): Natspec {
        let natspec: Natspec;
        natspec = Object.assign({}, userdoc, devdoc);
        Object.keys(userdoc.methods).forEach((methodName: string) => {
            natspec.methods[methodName] = Object.assign(
                userdoc.methods[methodName],
                natspec.methods[methodName],
            );
        });
        return  natspec;
    }

  // @get('/pclass/{id}/compile', {
  //   responses: {
  //     '200': {
  //       description: 'PClass model instance',
  //       content: {'application/json': {'x-ts-type': PClass}},
  //     },
  //   },
  // })
  // async compileSolidityPClass(@param.path.string('id') id: string): Promise<PClass> {
  //   let compiled: any;
  //   let metadata: any;
  //   let updateData: any = {pclass: {}};
  //   const pclass =  await this.pclassRepository.findById(id);
  //
  //   // Do not compile and update the pclass if we already have the abi & docs
  //   if (
  //       pclass.pclass &&
  //       pclass.pclass.gapi &&
  //       pclass.pclass.devdoc &&
  //       pclass.pclass.userdoc
  //   ) {
  //       return pclass;
  //   }
  //
  //   if (!pclass.pclass.flatsource) {
  //       throw new Error('No Solidity source was found and no ABI, devdoc, userdoc.');
  //   }
  //
  //   compiled = this.compile(pclass.pclass.flatsource);
  //
  //   console.log('compiled', compiled);
  //
  //   if (!compiled.contracts[`:${pclass.name}`]) {
  //       throw new Error('Contract name is incorrect, retrieving info from compiled data failed.');
  //   }
  //
  //   compiled = compiled.contracts[`:${pclass.name}`];
  //   metadata = JSON.parse(compiled.metadata);
  //
  //   updateData.pclass.devdoc = metadata.output.devdoc;
  //   updateData.pclass.userdoc = metadata.output.userdoc;
  //
  //   if (!pclass.pclass.gapi) {
  //       updateData.pclass.gapi = JSON.parse(compiled.interface);
  //       updateData.pclass.bytecode = compiled.bytecode;
  //   }
  //
  //   await this.pclassRepository.updateById(pclass._id, updateData);
  //   const updatedPclass = await this.pclassRepository.findById(pclass._id, updateData);
  //
  //   if (updateData.pclass.gapi) {
  //       console.log('createFunctionsFromPClass');
  //       this.createFunctionsFromPClass(updatedPclass).catch(e => {
  //           console.log('createFunctionsFromPClass', e);
  //           this.pclassRepository.deleteById(updatedPclass._id);
  //       });
  //   }
  //   return updatedPclass;
  // }
  //
}
