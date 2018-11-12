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
import {Project} from '../models';
import {ProjectRepository} from '../repositories';

export class ProjectController {
  constructor(
    @repository(ProjectRepository)
    public projectRepository : ProjectRepository,
  ) {}

  @post('/project', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {'x-ts-type': Project}},
      },
    },
  })
  async create(@requestBody() project: Project): Promise<Project> {
    return await this.projectRepository.create(project);
  }

  @get('/project/count', {
    responses: {
      '200': {
        description: 'Project model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Project)) where?: Where,
  ): Promise<Count> {
    return await this.projectRepository.count(where);
  }

  @get('/project', {
    responses: {
      '200': {
        description: 'Array of Project model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Project}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Project)) filter?: Filter,
  ): Promise<Project[]> {
    return await this.projectRepository.find(filter);
  }

  @patch('/project', {
    responses: {
      '200': {
        description: 'Project PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() project: Project,
    @param.query.object('where', getWhereSchemaFor(Project)) where?: Where,
  ): Promise<Count> {
    return await this.projectRepository.updateAll(project, where);
  }

  @get('/project/{id}', {
    responses: {
      '200': {
        description: 'Project model instance',
        content: {'application/json': {'x-ts-type': Project}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Project> {
    return await this.projectRepository.findById(id);
  }

  @patch('/project/{id}', {
    responses: {
      '204': {
        description: 'Project PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() project: Project,
  ): Promise<void> {
    await this.projectRepository.updateById(id, project);
  }

  @del('/project/{id}', {
    responses: {
      '204': {
        description: 'Project DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.projectRepository.deleteById(id);
  }
}
