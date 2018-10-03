import {Filter, repository, Where} from '@loopback/repository';
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
import {PipeContainerRepository, PipeFunctionRepository} from '../repositories';
import {AbiFunctionInput, AbiFunctionOuput, AbiFunction} from '../interfaces/abi';
import {
    DocParams,
    DocMethod,
    DocMethods,
    Devdoc,
    Userdoc,
} from '../interfaces/soldocs';

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
    // console.log('pipeContainer', pipeContainer);

    // separate abi in functions
    // separate devdoc & userdoc in functions
    let abi: AbiFunction[], devdoc: Devdoc, userdoc: Userdoc;
    let emptydoc = {methods: {}};

    let newContainer = await this.pipeContainerRepository.create(pipeContainer);
    // console.log('newContainer', newContainer);

    abi = pipeContainer.abi ? JSON.parse(pipeContainer.abi) : [];
    devdoc = pipeContainer.devdoc ? JSON.parse(pipeContainer.devdoc) : emptydoc;
    userdoc = pipeContainer.userdoc ? JSON.parse(pipeContainer.userdoc) : emptydoc;

    abi.forEach((funcabi: AbiFunction) => {
        let signature, functiondoc;

        signature = funcabi.inputs.map((input: AbiFunctionInput) => input.type).join(',');
        signature = `${funcabi.name}(${signature})`;

        functiondoc = {
            name: funcabi.name,
            signature,
            abi: JSON.stringify(funcabi),
            devdoc: devdoc.methods[signature],
            userdoc: userdoc.methods[signature],
            uri: pipeContainer.uri,
            tags: pipeContainer.tags,
            timestamp: pipeContainer.timestamp,
            containerid: newContainer._id,
        }
    });

    // return await this.pipeContainerRepository.create(pipeContainer);
    return await this.pipeContainerRepository.findById("5bb52a1f55b4fd09de76e1d0");
  }

  @get('/pipecontainer/count', {
    responses: {
      '200': {
        description: 'PipeContainer model count',
        content: {'application/json': {'x-ts-type': Number}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PipeContainer)) where?: Where,
  ): Promise<number> {
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
        content: {'application/json': {'x-ts-type': Number}},
      },
    },
  })
  async updateAll(
    @requestBody() pipeContainer: PipeContainer,
    @param.query.object('where', getWhereSchemaFor(PipeContainer)) where?: Where,
  ): Promise<number> {
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

  @patch('/pipecontainer/{id}', {
    responses: {
      '204': {
        description: 'PipeContainer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() pipeContainer: PipeContainer,
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
}
