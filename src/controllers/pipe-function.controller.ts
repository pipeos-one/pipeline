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
import {PipeFunction} from '../models';
import {PipeFunctionRepository} from '../repositories';

export class PipeFunctionController {
  constructor(
    @repository(PipeFunctionRepository)
    public pipeFunctionRepository : PipeFunctionRepository,
  ) {}

  @post('/pipefunction', {
    responses: {
      '200': {
        description: 'PipeFunction model instance',
        content: {'application/json': {'x-ts-type': PipeFunction}},
      },
    },
  })
  async create(@requestBody() pipeFunction: PipeFunction): Promise<PipeFunction> {
    return await this.pipeFunctionRepository.create(pipeFunction);
  }

  @get('/pipefunction/count', {
    responses: {
      '200': {
        description: 'PipeFunction model count',
        content: {'application/json': {'x-ts-type': Number}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PipeFunction)) where?: Where,
  ): Promise<number> {
    return await this.pipeFunctionRepository.count(where);
  }

  @get('/pipefunction', {
    responses: {
      '200': {
        description: 'Array of PipeFunction model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': PipeFunction}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(PipeFunction)) filter?: Filter,
  ): Promise<PipeFunction[]> {
    return await this.pipeFunctionRepository.find(filter);
  }

  @patch('/pipefunction', {
    responses: {
      '200': {
        description: 'PipeFunction PATCH success count',
        content: {'application/json': {'x-ts-type': Number}},
      },
    },
  })
  async updateAll(
    @requestBody() pipeFunction: PipeFunction,
    @param.query.object('where', getWhereSchemaFor(PipeFunction)) where?: Where,
  ): Promise<number> {
    return await this.pipeFunctionRepository.updateAll(pipeFunction, where);
  }

  @get('/pipefunction/{id}', {
    responses: {
      '200': {
        description: 'PipeFunction model instance',
        content: {'application/json': {'x-ts-type': PipeFunction}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<PipeFunction> {
    return await this.pipeFunctionRepository.findById(id);
  }

  @patch('/pipefunction/{id}', {
    responses: {
      '204': {
        description: 'PipeFunction PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() pipeFunction: PipeFunction,
  ): Promise<void> {
    await this.pipeFunctionRepository.updateById(id, pipeFunction);
  }

  @del('/pipefunction/{id}', {
    responses: {
      '204': {
        description: 'PipeFunction DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pipeFunctionRepository.deleteById(id);
  }
}
