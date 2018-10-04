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
import {PipeContainer} from '../models';
import {PipeContainerRepository} from '../repositories';

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
