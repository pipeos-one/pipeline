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
import {Graph} from '../models';
import {GraphRepository} from '../repositories';

export class GraphController {
  constructor(
    @repository(GraphRepository)
    public graphRepository : GraphRepository,
  ) {}

  @post('/graph', {
    responses: {
      '200': {
        description: 'Graph model instance',
        content: {'application/json': {'x-ts-type': Graph}},
      },
    },
  })
  async create(@requestBody() graph: Graph): Promise<Graph> {
    return await this.graphRepository.create(graph);
  }

  @get('/graph/count', {
    responses: {
      '200': {
        description: 'Graph model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Graph)) where?: Where,
  ): Promise<Count> {
    return await this.graphRepository.count(where);
  }

  @get('/graph', {
    responses: {
      '200': {
        description: 'Array of Graph model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Graph}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Graph)) filter?: Filter,
  ): Promise<Graph[]> {
    return await this.graphRepository.find(filter);
  }

  @patch('/graph', {
    responses: {
      '200': {
        description: 'Graph PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() graph: Graph,
    @param.query.object('where', getWhereSchemaFor(Graph)) where?: Where,
  ): Promise<Count> {
    return await this.graphRepository.updateAll(graph, where);
  }

  @get('/graph/{id}', {
    responses: {
      '200': {
        description: 'Graph model instance',
        content: {'application/json': {'x-ts-type': Graph}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Graph> {
    return await this.graphRepository.findById(id);
  }

  @patch('/graph/{id}', {
    responses: {
      '204': {
        description: 'Graph PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() graph: Graph,
  ): Promise<void> {
    await this.graphRepository.updateById(id, graph);
  }

  @del('/graph/{id}', {
    responses: {
      '204': {
        description: 'Graph DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.graphRepository.deleteById(id);
  }
}
