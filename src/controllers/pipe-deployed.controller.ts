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
import {PipeDeployed} from '../models';
import {PipeDeployedRepository} from '../repositories';

export class PipeDeployedController {
  constructor(
    @repository(PipeDeployedRepository)
    public pipeDeployedRepository : PipeDeployedRepository,
  ) {}

  @post('/pipedeployed', {
    responses: {
      '200': {
        description: 'PipeDeployed model instance',
        content: {'application/json': {'x-ts-type': PipeDeployed}},
      },
    },
  })
  async create(@requestBody() pipeDeployed: PipeDeployed): Promise<PipeDeployed> {
    return await this.pipeDeployedRepository.create(pipeDeployed);
  }

  @get('/pipedeployed/count', {
    responses: {
      '200': {
        description: 'PipeDeployed model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(PipeDeployed)) where?: Where,
  ): Promise<Count> {
    return await this.pipeDeployedRepository.count(where);
  }

  @get('/pipedeployed', {
    responses: {
      '200': {
        description: 'Array of PipeDeployed model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': PipeDeployed}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(PipeDeployed)) filter?: Filter,
  ): Promise<PipeDeployed[]> {
    return await this.pipeDeployedRepository.find(filter);
  }

  @patch('/pipedeployed', {
    responses: {
      '200': {
        description: 'PipeDeployed PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() pipeDeployed: PipeDeployed,
    @param.query.object('where', getWhereSchemaFor(PipeDeployed)) where?: Where,
  ): Promise<Count> {
    return await this.pipeDeployedRepository.updateAll(pipeDeployed, where);
  }

  @get('/pipedeployed/{id}', {
    responses: {
      '200': {
        description: 'PipeDeployed model instance',
        content: {'application/json': {'x-ts-type': PipeDeployed}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<PipeDeployed> {
    return await this.pipeDeployedRepository.findById(id);
  }

  @patch('/pipedeployed/{id}', {
    responses: {
      '204': {
        description: 'PipeDeployed PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() pipeDeployed: PipeDeployed,
  ): Promise<void> {
    await this.pipeDeployedRepository.updateById(id, pipeDeployed);
  }

  @del('/pipedeployed/{id}', {
    responses: {
      '204': {
        description: 'PipeDeployed DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.pipeDeployedRepository.deleteById(id);
  }
}
