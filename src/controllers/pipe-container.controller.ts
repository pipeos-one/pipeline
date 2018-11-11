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
} from '@loopback/rest';
import {PipeContainer, SmartContractContainer, PipeFunction, PipeDeployed, EthUri} from '../models';
import {PipeContainerRepository} from '../repositories';
import {PipeFunctionController, PipeDeployedController} from '../controllers';
import {AbiFunctionInput, AbiFunctionOuput, AbiFunction} from '../interfaces/abi';
import {
    Devdoc,
    Userdoc,
} from '../interfaces/soldocs';
import {GetContainerFunctionsDeployed} from '../interfaces';

let solc = require('solc');

export class PipeContainerController {
  constructor(
    @repository(PipeContainerRepository)
    public pipeContainerRepository : PipeContainerRepository,
  ) {}

  @post('/pipecontainer', {
    responses: {
      '200': {
        description: 'PipeContainer model instance',
        content: {'application/json': {'x-ts-type': PipeContainer}},
      },
    },
  })
  async create(@requestBody() pipeContainer: PipeContainer): Promise<PipeContainer> {
    return await this.pipeContainerRepository.create(pipeContainer);
  }

  @get('/pipecontainer/count', {
    responses: {
      '200': {
        description: 'PipeContainer model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PipeContainer)) where?: Where,
  ): Promise<Count> {
    return await this.pipeContainerRepository.count(where);
  }

  @get('/pipecontainer', {
    responses: {
      '200': {
        description: 'Array of PipeContainer model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': PipeContainer}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(PipeContainer)) filter?: Filter,
  ): Promise<PipeContainer[]> {
    return await this.pipeContainerRepository.find(filter);
  }

  @patch('/pipecontainer', {
    responses: {
      '200': {
        description: 'PipeContainer PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() pipeContainer: PipeContainer,
    @param.query.object('where', getWhereSchemaFor(PipeContainer)) where?: Where,
  ): Promise<Count> {
    return await this.pipeContainerRepository.updateAll(pipeContainer, where);
  }

  @get('/pipecontainer/{id}', {
    responses: {
      '200': {
        description: 'PipeContainer model instance',
        content: {'application/json': {'x-ts-type': PipeContainer}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<PipeContainer> {
    return await this.pipeContainerRepository.findById(id);
  }

  @get('/pipecontainer/{id}/js', {
    responses: {
      '200': {
        description: 'PipeContainer JS script',
        content: {'application/javascript': {'x-ts-type': PipeContainer}},
      },
    },
  })
  async getJSById(@param.path.string('id') id: string): Promise<string> {
    const pipecontainer = await this.pipeContainerRepository.findById(id);
    return (<SmartContractContainer>pipecontainer.container).jssource || '';
  }

  @patch('/pipecontainer/{id}', {
    responses: {
      '204': {
        description: 'PipeContainer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() pipeContainer: Partial<PipeContainer>,
  ): Promise<void> {
    await this.pipeContainerRepository.updateById(id, pipeContainer);
  }

  @del('/pipecontainer/{id}', {
    responses: {
      '204': {
        description: 'PipeContainer DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pipeContainerRepository.deleteById(id);
  }

  @get('/pipecontainer/pipefunctions')
  async findContainerFunctionsDeployed(
      @param.query.object('filter', getFilterSchemaFor(PipeContainer)) filter?: Filter,
  ): Promise<GetContainerFunctionsDeployed> {
    let functions_filter, deployed_queries, deployed_filter;
    let pipecontainers, pipedeployments, pipefunctions;

    let pipefunctionRepository = await this.pipeContainerRepository.pipefunctions;
    let deployedRepository = await this.pipeContainerRepository.deployed;

    pipecontainers = await this.pipeContainerRepository.find(filter);

    // PipeFunction filter
    functions_filter = JSON.parse(JSON.stringify({where: {or: pipecontainers.map(container => {
        return {"containerid": {"like": container._id}};
    })}}));

    // PipeDeployed filter
    deployed_queries = [];
    if (filter && filter.where && filter.where.chainids) {
        deployed_queries.push({or: filter.where.chainids.inq.map((chainid: string) => {
            return {'deployed.chainid': chainid}
        })});
    }
    deployed_filter = JSON.parse(JSON.stringify({where: {and:
        [functions_filter.where].concat(deployed_queries),
    }}));

    pipefunctions = await pipefunctionRepository.find(functions_filter);
    pipedeployments = await deployedRepository.find(deployed_filter);

    return {pipecontainers, pipedeployments, pipefunctions};
  }

  // Additional routes
  @post('/pipecontainer/pipefunctions')
  async createFunctions(
    @requestBody() pipeContainer: PipeContainer,
  ): Promise<PipeContainer | void> {
    // For a Solidity smart contract, if we only have the source, we try to compile it
    // so we can store the abi, devdoc & userdoc
    pipeContainer.container = this.tryCompileSmartContractContainer(
        pipeContainer.name,
        (<SmartContractContainer>pipeContainer.container)
    );
    let newContainer = await this.create(pipeContainer);

    this.createFunctionsFromContainer(newContainer).catch((e: Error) => {
        console.log('createFunctionsFromContainer', e);
        this.deleteContainerFunctions(newContainer._id);
        return this.deleteById(newContainer._id);
    });
    return newContainer;
  }

  @post('/pipecontainer/pipedeployed', {
    responses: {
      '200': {
        description: 'PipeDeployed model instance',
        content: {'application/json': {'x-ts-type': PipeDeployed}},
      },
    },
  })
  async addDeployed(
      @requestBody() pipeDeployed: PipeDeployed,
  ): Promise<PipeDeployed> {
    let deployedRepository = await this.pipeContainerRepository.deployed;
    let container = await this.findById(pipeDeployed.containerid);

    container.chainids = container.chainids || [];
    if (!container.chainids.includes((<EthUri>pipeDeployed.deployed).chainid)) {
        container.chainids.push((<EthUri>pipeDeployed.deployed).chainid);
        await this.updateById(pipeDeployed.containerid, {chainids: container.chainids});
    }
    return await deployedRepository.create(pipeDeployed);
  }

  @post('/pipecontainer/{id}/pipefunctions')
  async createFunctionsFromContainer(
    @requestBody() pipeContainer: PipeContainer,
): Promise<PipeContainer | void> {
    let abi: AbiFunction[], devdoc: Devdoc, userdoc: Userdoc;
    let emptydoc = {methods: {}};

    abi = pipeContainer.container.abi || [];
    devdoc = pipeContainer.container.devdoc || emptydoc;
    userdoc = pipeContainer.container.userdoc || emptydoc;

    for (let i=0; i < abi.length; i++) {
        let funcabi: AbiFunction = abi[i];
        let signature, functiondoc;

        signature = funcabi.inputs.map((input: AbiFunctionInput) => input.type).join(',');
        signature = funcabi.name ? `${funcabi.name}(${signature})` : undefined;
        functiondoc = {
            signature,
            abiObj: funcabi,
            devdoc: signature ? devdoc.methods[signature] : undefined,
            userdoc: signature ? userdoc.methods[signature] : undefined,
            uri: pipeContainer.uri,
            tags: pipeContainer.tags,
            timestamp: pipeContainer.timestamp,
            chainids: pipeContainer.chainids,
        }
        let pipefunction = await this.pipeContainerRepository.functions(pipeContainer._id).create(functiondoc);

        if (!this.pipeContainerRepository.functions(pipeContainer._id).find({where: {_id: pipefunction._id}})) {
            throw new Error(`Function ${functiondoc.abiObj}was not created.`)
        };
    };
    return;
  }

  @del('/pipecontainer/{id}/pipefunctions', {
    responses: {
      '200': {
        description: 'PipeContainer.PipeFunction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async deleteContainerFunctions(
    @param.path.string('id') id: string,
    // @param.query.object('where', getWhereSchemaFor(PipeFunction)) where?: Where,
  ): Promise<Count> {
    let pipefunctionRepository = await this.pipeContainerRepository.pipefunctions;
    let pipeFunctionController = new PipeFunctionController(pipefunctionRepository);

    let deployedRepository = await this.pipeContainerRepository.deployed;
    let deployedController = new PipeDeployedController(deployedRepository);

    await this.pipeContainerRepository.deleteById(id);
    await deployedController.delete({containerid: {like: id}});
    return await pipeFunctionController.delete({containerid: {like: id}}); 

    // return await this.pipeContainerRepository.functions(id).delete();
  }

    tryCompileSmartContractContainer(contractName: string, container: SmartContractContainer): any {
        let compiled, metadata;
        if (container.solsource && (!container.abi || !container.devdoc || !container.userdoc)) {
            compiled = this.compile(container.solsource);
            metadata = JSON.parse(compiled.contracts[`:${contractName}`].metadata)
            container.abi = container.abi || metadata.output.abi;
            container.devdoc = container.devdoc || metadata.output.devdoc;
            container.userdoc = container.userdoc || metadata.output.userdoc;
        }
        return container;
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

  // @get('/pipecontainer/{id}/compile', {
  //   responses: {
  //     '200': {
  //       description: 'PipeContainer model instance',
  //       content: {'application/json': {'x-ts-type': PipeContainer}},
  //     },
  //   },
  // })
  // async compileSolidityContainer(@param.path.string('id') id: string): Promise<PipeContainer> {
  //   let compiled: any;
  //   let metadata: any;
  //   let updateData: any = {container: {}};
  //   const pipeContainer =  await this.pipeContainerRepository.findById(id);
  //
  //   // Do not compile and update the container if we already have the abi & docs
  //   if (
  //       pipeContainer.container &&
  //       pipeContainer.container.abi &&
  //       pipeContainer.container.devdoc &&
  //       pipeContainer.container.userdoc
  //   ) {
  //       return pipeContainer;
  //   }
  //
  //   if (!pipeContainer.container.solsource) {
  //       throw new Error('No Solidity source was found and no ABI, devdoc, userdoc.');
  //   }
  //
  //   compiled = this.compile(pipeContainer.container.solsource);
  //
  //   console.log('compiled', compiled);
  //
  //   if (!compiled.contracts[`:${pipeContainer.name}`]) {
  //       throw new Error('Contract name is incorrect, retrieving info from compiled data failed.');
  //   }
  //
  //   compiled = compiled.contracts[`:${pipeContainer.name}`];
  //   metadata = JSON.parse(compiled.metadata);
  //
  //   updateData.container.devdoc = metadata.output.devdoc;
  //   updateData.container.userdoc = metadata.output.userdoc;
  //
  //   if (!pipeContainer.container.abi) {
  //       updateData.container.abi = JSON.parse(compiled.interface);
  //       updateData.container.bytecode = compiled.bytecode;
  //   }
  //
  //   await this.pipeContainerRepository.updateById(pipeContainer._id, updateData);
  //   const updatedContainer = await this.pipeContainerRepository.findById(pipeContainer._id, updateData);
  //
  //   if (updateData.container.abi) {
  //       console.log('createFunctionsFromContainer');
  //       this.createFunctionsFromContainer(updatedContainer).catch(e => {
  //           console.log('createFunctionsFromContainer', e);
  //           this.pipeContainerRepository.deleteById(updatedContainer._id);
  //       });
  //   }
  //   return updatedContainer;
  // }
  //
}
