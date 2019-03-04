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
import {PClassI} from '../models';
import {PClassIRepository} from '../repositories';

export class PClassIController {
  constructor(
    @repository(PClassIRepository)
    public pclassIRepository : PClassIRepository,
  ) {}

  @post('/pclassi', {
    responses: {
      '200': {
        description: 'PClassI model instance',
        content: {'application/json': {'x-ts-type': PClassI}},
      },
    },
  })
  async create(@requestBody() pclassi: PClassI): Promise<PClassI> {
    return await this.pclassIRepository.create(pclassi);
  }

  @get('/pclassi/count', {
    responses: {
      '200': {
        description: 'PClassI model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PClassI)) where?: Where,
  ): Promise<Count> {
    return await this.pclassIRepository.count(where);
  }

  @get('/pclassi', {
    responses: {
      '200': {
        description: 'Array of PClassI model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': PClassI}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(PClassI)) filter?: Filter,
  ): Promise<PClassI[]> {
    return await this.pclassIRepository.find(filter);
  }

  @patch('/pclassi', {
    responses: {
      '200': {
        description: 'PClassI PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() pclassi: Partial<PClassI>,
    @param.query.object('where', getWhereSchemaFor(PClassI)) where?: Where,
  ): Promise<Count> {
    return await this.pclassIRepository.updateAll(pclassi, where);
  }

  @get('/pclassi/{id}', {
    responses: {
      '200': {
        description: 'PClassI model instance',
        content: {'application/json': {'x-ts-type': PClassI}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<PClassI> {
    return await this.pclassIRepository.findById(id);
  }

  @patch('/pclassi/{id}', {
    responses: {
      '204': {
        description: 'PClassI PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() pclassi: PClassI,
  ): Promise<void> {
    await this.pclassIRepository.updateById(id, pclassi);
  }

  @del('/pclassi/{id}', {
    responses: {
      '204': {
        description: 'PClassI DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pclassIRepository.deleteById(id);
  }

  @del('/pclassi/{id}', {
      responses: {
          '200': {
              description: 'PClassI DELETE success count',
              content: {'application/json': {schema: CountSchema}},
          },
      },
  })
  async delete(
      @param.query.object('where', getWhereSchemaFor(PClassI)) where?: Where,
  ): Promise<Count> {
    return await this.pclassIRepository.deleteAll(where);
  }
}
