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
import {Openapi} from '../models';
import {OpenapiRepository} from '../repositories';

export class OpenapiController {
  constructor(
    @repository(OpenapiRepository)
    public openapiRepository : OpenapiRepository,
  ) {}

  @post('/openapi', {
    responses: {
      '200': {
        description: 'Openapi model instance',
        content: {'application/json': {'x-ts-type': Openapi}},
      },
    },
  })
  async create(@requestBody() openapi: Openapi): Promise<Openapi> {
    return await this.openapiRepository.create(openapi);
  }

  @get('/openapi/count', {
    responses: {
      '200': {
        description: 'Openapi model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Openapi)) where?: Where,
  ): Promise<Count> {
    return await this.openapiRepository.count(where);
  }

  @get('/openapi', {
    responses: {
      '200': {
        description: 'Array of Openapi model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Openapi}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Openapi)) filter?: Filter,
  ): Promise<Openapi[]> {
    return await this.openapiRepository.find(filter);
  }

  @patch('/openapi', {
    responses: {
      '200': {
        description: 'Openapi PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() openapi: Openapi,
    @param.query.object('where', getWhereSchemaFor(Openapi)) where?: Where,
  ): Promise<Count> {
    return await this.openapiRepository.updateAll(openapi, where);
  }

  @get('/openapi/{id}', {
    responses: {
      '200': {
        description: 'Openapi model instance',
        content: {'application/json': {'x-ts-type': Openapi}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Openapi> {
    return await this.openapiRepository.findById(id);
  }

  @patch('/openapi/{id}', {
    responses: {
      '204': {
        description: 'Openapi PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() openapi: Openapi,
  ): Promise<void> {
    await this.openapiRepository.updateById(id, openapi);
  }

  @del('/openapi/{id}', {
    responses: {
      '204': {
        description: 'Openapi DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.openapiRepository.deleteById(id);
  }
}
