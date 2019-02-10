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
import {PFunction} from '../models';
import {PFunctionRepository} from '../repositories';

export class PFunctionController {
  constructor(
    @repository(PFunctionRepository)
    public pfunctionRepository : PFunctionRepository,
  ) {}

  @post('/pfunction', {
    responses: {
      '200': {
        description: 'PFunction model instance',
        content: {'application/json': {'x-ts-type': PFunction}},
      },
    },
  })
  async create(@requestBody() pfunction: PFunction): Promise<PFunction> {
    return await this.pfunctionRepository.create(pfunction);
  }

  @get('/pfunction/count', {
    responses: {
      '200': {
        description: 'PFunction model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PFunction)) where?: Where,
  ): Promise<Count> {
    return await this.pfunctionRepository.count(where);
  }

  @get('/pfunction', {
    responses: {
      '200': {
        description: 'Array of PFunction model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': PFunction}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(PFunction)) filter?: Filter,
  ): Promise<PFunction[]> {
    return await this.pfunctionRepository.find(filter);
  }

  @patch('/pfunction', {
    responses: {
      '200': {
        description: 'PFunction PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() pfunction: PFunction,
    @param.query.object('where', getWhereSchemaFor(PFunction)) where?: Where,
  ): Promise<Count> {
    return await this.pfunctionRepository.updateAll(pfunction, where);
  }

  @del('/pfunction', {
    responses: {
      '200': {
        description: 'PFunction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.query.object('where', getWhereSchemaFor(PFunction)) where: Where,
  ): Promise<Count> {
    return await this.pfunctionRepository.deleteAll(where);
  }

  @get('/pfunction/{id}', {
    responses: {
      '200': {
        description: 'PFunction model instance',
        content: {'application/json': {'x-ts-type': PFunction}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<PFunction> {
    return await this.pfunctionRepository.findById(id);
  }

  @patch('/pfunction/{id}', {
    responses: {
      '204': {
        description: 'PFunction PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() pfunction: PFunction,
  ): Promise<void> {
    await this.pfunctionRepository.updateById(id, pfunction);
  }

  @del('/pfunction/{id}', {
    responses: {
      '204': {
        description: 'PFunction DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pfunctionRepository.deleteById(id);
  }
}
