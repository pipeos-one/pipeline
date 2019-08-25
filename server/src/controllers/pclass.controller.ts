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
import {PClass, SolClass, JsClass, PFunction, PClassI, SolInstance, SolFunction} from '../models';
import {PClassRepository} from '../repositories';
import {PFunctionController, PClassIController} from '../controllers';
import {AbiFunctionInput, AbiFunction} from '../interfaces/gapi';
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
    let functions_filter, pclassi_queries: any[], pclassi_filter, pclassids;
    let pclasses, pclassii, pfunctions;

    let pfunctionRepository = await this.pclassRepository.pfunctions;
    let pclassiRepository = await this.pclassRepository.pclassi;

    pclasses = await this.pclassRepository.find(filter);

    // PFunction filter
    pclassids = pclasses.map(pclass => {
        return {"pclassid": {"like": pclass._id}};
    });
    if (pclassids.length == 0) {
        pclassids = [{"pclassid": {"like": "xxxxxx"}}];
    }
    functions_filter = JSON.parse(JSON.stringify({where: {or: pclassids}}));

    // PClassI filter
    pclassi_queries = [];
    if (filter && filter.where && filter.where.chainids) {
        pclassi_queries.push({or: filter.where.chainids.inq.map((chainid: string) => {
            return {'pclassi.chainid': chainid}
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
    let newPclass: any;
    // For a Solidity smart contract, if we only have the source, we try to compile it
    // so we can store the abi, natspec
    pclass.pclass = this.tryCompileSolClass(
        pclass.name,
        (<SolClass>pclass.pclass)
    );

    if (!pclass.pclass) {
        throw new HttpErrors.InternalServerError('PClass instance does not contain pclass');
    }

    // If there is a duplicate, we don't insert anything, but return the record
    let alreadyInserted = await this.find({where: {name: pclass.name}});
    console.log('alreadyInserted', alreadyInserted.length);
    newPclass = alreadyInserted.find((inserted: any) => {
        return JSON.stringify(inserted.pclass.gapi) == JSON.stringify(pclass.pclass.gapi);
    });

    if (!newPclass) {
        newPclass = await this.create(pclass).catch(e => console.log('create err', pclass.name, e));
        if (!newPclass) {
            throw new Error('no newPclass inserted ' + pclass.name);
        }
        await this.createFunctionsFromPClass((<PClass>newPclass)).catch((e: Error) => {
            this.deletePClassFunctions((<PClass>newPclass)._id);
            return this.deleteById((<PClass>newPclass)._id);
        });
    }
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
    let pfunctionRepository = await this.pclassRepository.pfunctions;
    let pclass = await this.findById(pclassi.pclassid);

    pclass.chainids = pclass.chainids || [];
    if (!pclass.chainids.includes((<SolInstance>pclassi.pclassi).chainid)) {
        pclass.chainids.push((<SolInstance>pclassi.pclassi).chainid);
        await this.updateById(pclassi.pclassid, {chainids: pclass.chainids});
        // Update all functions chainids
        // Updating internal attributes doesn't work in loopback now
        let funcToUpdate = await pfunctionRepository.find({where: {pclassid: pclassi.pclassid}});
        console.log('funcToUpdate', funcToUpdate.length);
        for (let i = 0; i < funcToUpdate.length; i++) {
            (<SolFunction>funcToUpdate[i].pfunction).chainids = pclass.chainids;
            await pfunctionRepository.updateById(funcToUpdate[i]._id, {pfunction: funcToUpdate[i].pfunction});
        }
    }
    // Bad, bad dev
    const pclassFilter: any = JSON.parse(JSON.stringify({where: {"pclassi.address": (<SolInstance>pclassi.pclassi).address, "pclassi.chainid": (<SolInstance>pclassi.pclassi).chainid}}));
    const pclassiExists = await pclassiRepository.find(pclassFilter);
    if (pclassiExists &&  pclassiExists[0]) return pclassiExists[0];
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
        let signature, functiondoc, sourceByFunctionName: any;

        if (funcapi.inputs) {
            signature = funcapi.inputs.map((input: AbiFunctionInput) => input.type).join(',');
        }
        signature = funcapi.name ? `${funcapi.name}(${signature})` : undefined;
        sourceByFunctionName = (<JsClass>pclass.pclass).sourceByFunctionName;
        functiondoc = {
            pfunction: {
                signature,
                gapi: funcapi,
                natspec: signature ? natspec.methods[signature] : undefined,
                chainids: pclass.chainids,
                source: sourceByFunctionName ? sourceByFunctionName[funcapi.name] : undefined,
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
        description: 'PClass, PClassi, PFunction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async deletePClassFunctions(
    @param.path.string('id') id: string,
    // @param.query.object('where', getWhereSchemaFor(PFunction)) where?: Where,
  ): Promise<Count> {
    let count: Count;
    let pfunctionRepository = await this.pclassRepository.pfunctions;
    let pfunctionController = new PFunctionController(pfunctionRepository);

    let pclassiRepository = await this.pclassRepository.pclassi;
    let pclassiController = new PClassIController(pclassiRepository);
    count = await pfunctionController.delete({pclassid: id});
    if (count.count === 0) {
        throw new HttpErrors.InternalServerError('No PFunctions Deleted')
    }
    await pclassiController.delete({pclassid: id});
    await this.pclassRepository.deleteById(id);
    return count;

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
                } catch(e) {
                    console.log(`Metadata could not be parsed: ${e}, ${compiled.contracts[`:${contractName}`].metadata}`);
                }
            } else if (compiled.errors && compiled.errors[0].includes('ParserError: Expected pragma')) {
                pclass.flatsource = '// No source code available.';
            }
        }
        if (pclass.flatsource && !pclass.gapi) {
            console.log(contractName + ' not inserted, no ABI.');
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
