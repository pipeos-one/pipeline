var solc = require('solc');
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
import {PipeContainer, PipeFunction} from '../models';
import {PipeContainerRepository} from '../repositories';
import {AbiFunctionInput, AbiFunctionOuput, AbiFunction} from '../interfaces/abi';
import {
    Devdoc,
    Userdoc,
} from '../interfaces/soldocs';


export class PipeContainerFunctionController {
  constructor(
    @repository(PipeContainerRepository)
    protected pipeContainerRepository: PipeContainerRepository,
  ) {}

  @post('/pipecontainer/{id}/pipefunction')
  async createFunction(
    @param.path.number('id') containerid: typeof PipeContainer.prototype._id,
    @requestBody() pipeFunctionData: PipeFunction,
  ): Promise<PipeFunction> {
    return await this.pipeContainerRepository.functions(containerid).create(pipeFunctionData);
  }

  @post('/pipecontainerfunctions')
  async createFunctions(
    @requestBody() pipeContainer: PipeContainer,
): Promise<PipeContainer | void> {
    let newContainer = await this.pipeContainerRepository.create(pipeContainer);
    this.createFunctionsFromContainer(newContainer).catch(e => {
        console.log('createFunctionsFromContainer', e);
        return this.deleteContainerFunctions(newContainer._id);
    });
    return newContainer;
  }

  async createFunctionsFromContainer(pipeContainer: PipeContainer) {
      let abi: AbiFunction[], devdoc: Devdoc, userdoc: Userdoc;
      let emptydoc = {methods: {}};

      abi = pipeContainer.abi || [];
      devdoc = pipeContainer.devdoc || emptydoc;
      userdoc = pipeContainer.userdoc || emptydoc;

      for (let i=0; i < abi.length; i++) {
          let funcabi: AbiFunction = abi[i];
          let signature, functiondoc;

          signature = funcabi.inputs.map((input: AbiFunctionInput) => input.type).join(',');
          signature = `${funcabi.name}(${signature})`;
          functiondoc = {
              signature,
              abiObj: funcabi,
              devdoc: devdoc.methods[signature],
              userdoc: userdoc.methods[signature],
              uri: pipeContainer.uri,
              tags: pipeContainer.tags,
              timestamp: pipeContainer.timestamp,
          }
          let pipefunction = await this.pipeContainerRepository.functions(pipeContainer._id).create(functiondoc);

          if (!this.pipeContainerRepository.functions(pipeContainer._id).find({where: {_id: pipefunction._id}})) {
              throw new Error(`Function ${functiondoc.abiObj}was not created.`)
          };
      };
      return;
  }

  @get('/pipecontainer/{id}/compile', {
    responses: {
      '200': {
        description: 'PipeContainer model instance',
        content: {'application/json': {'x-ts-type': PipeContainer}},
      },
    },
  })
  async compileSolidityContainer(@param.path.string('id') id: string): Promise<PipeContainer> {
    let compiled: any;
    let metadata: any;
    let updateData: any = {};
    const pipeContainer =  await this.pipeContainerRepository.findById(id);

    // Do not compile and update the container if we already have the abi & docs
    if (pipeContainer.abi && pipeContainer.devdoc && pipeContainer.userdoc) {
        return pipeContainer;
    }

    if (!pipeContainer.solsource) {
        throw new Error('No Solidity source was found and no ABI, devdoc, userdoc.');
    }

    compiled = this.compile(pipeContainer.solsource);

    console.log('compiled', compiled);

    if (!compiled.contracts[`:${pipeContainer.name}`]) {
        throw new Error('Contract name is incorrect, retrieving info from compiled data failed.');
    }

    compiled = compiled.contracts[`:${pipeContainer.name}`];
    metadata = JSON.parse(compiled.metadata);

    updateData.devdoc = metadata.output.devdoc;
    updateData.userdoc = metadata.output.userdoc;

    if (!pipeContainer.abi) {
        updateData.abi = JSON.parse(compiled.interface);
        updateData.bytecode = compiled.bytecode;
    }

    await this.pipeContainerRepository.updateById(pipeContainer._id, updateData);
    const updatedContainer = await this.pipeContainerRepository.findById(pipeContainer._id, updateData);

    if (updateData.abi) {
        console.log('createFunctionsFromContainer');
        this.createFunctionsFromContainer(updatedContainer).catch(e => {
            console.log('createFunctionsFromContainer', e);
            this.pipeContainerRepository.deleteById(updatedContainer._id);
        });
    }
    return updatedContainer;
  }

  compile(source: string): any {
    const compiled = solc.compile(source, 0);
    console.log('compiled', compiled);
    if (!compiled) {
        throw new Error('Compilation failed.');
    }
    return compiled;
  }

  @del('/pipecontainerfunctions/{id}', {
    responses: {
      '204': {
        description: 'PipeContainer and PipeFunctions DELETE success',
      },
    },
  })
  async deleteContainerFunctions(@param.path.string('id') id: string): Promise<void> {
    this.pipeContainerRepository.functions(id).delete({containerid: id});
    await this.pipeContainerRepository.deleteById(id);
  }
}
