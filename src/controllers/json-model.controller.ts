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
import {JsonModel} from '../models';
import {JsonModelRepository} from '../repositories';

export class JsonModelController {
  constructor(
    @repository(JsonModelRepository)
    public jsonModelRepository : JsonModelRepository,
  ) {}

  @post('/json', {
    responses: {
      '200': {
        description: 'JsonModel model instance',
        content: {'application/json': {'x-ts-type': JsonModel}},
      },
    },
  })
  async create(@requestBody() jsonModel: JsonModel): Promise<JsonModel> {
    return await this.jsonModelRepository.create(jsonModel);
  }

  @get('/json/count', {
    responses: {
      '200': {
        description: 'JsonModel model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(JsonModel)) where?: Where,
  ): Promise<Count> {
    return await this.jsonModelRepository.count(where);
  }

  @get('/json', {
    responses: {
      '200': {
        description: 'Array of JsonModel model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': JsonModel}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(JsonModel)) filter?: Filter,
  ): Promise<JsonModel[]> {
    return await this.jsonModelRepository.find(filter, {strictObjectIDCoercion: true});
  }

  @patch('/json', {
    responses: {
      '200': {
        description: 'JsonModel PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() jsonModel: JsonModel,
    @param.query.object('where', getWhereSchemaFor(JsonModel)) where?: Where,
  ): Promise<Count> {
    return await this.jsonModelRepository.updateAll(jsonModel, where);
  }

  @get('/json/{id}', {
    responses: {
      '200': {
        description: 'JsonModel model instance',
        content: {'application/json': {'x-ts-type': JsonModel}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<JsonModel> {
    return await this.jsonModelRepository.findById(id);
  }

  @patch('/json/{id}', {
    responses: {
      '204': {
        description: 'JsonModel PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() jsonModel: JsonModel,
  ): Promise<void> {
    await this.jsonModelRepository.updateById(id, jsonModel);
  }

  @del('/json/{id}', {
    responses: {
      '204': {
        description: 'JsonModel DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.jsonModelRepository.deleteById(id);
  }
}
