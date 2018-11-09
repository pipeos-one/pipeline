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
import {Openapi, PipeContainer} from '../models';
import {OpenapiRepository} from '../repositories';
import {PipeContainerController, PipeDeployedController} from '../controllers';
import {OpenapiToGabi} from '../utils/toGeneralizedAbi';


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
    let pipeContainer: any;
    let pipeDeployed: any;

    let containerRepository = await this.openapiRepository.container;
    let containerController = new PipeContainerController(containerRepository);

    let deployedRepository = await this.openapiRepository.deployed;
    let deployedController = new PipeDeployedController(deployedRepository);

    let gabi = new OpenapiToGabi(openapi.json);

    pipeContainer = {
        name: gabi.devdoc.title || 'unknown',
        container: {
            abi: gabi.gabi,
            devdoc: gabi.devdoc,
            userdoc: gabi.userdoc,
            openapiid: openapi._id,
        },
        tags: ['openapi'],
    }
    console.log('-- pipeContainer', JSON.stringify(pipeContainer));
    throw new Error('stop');
    pipeContainer = await containerController.createFunctions(pipeContainer).catch((e: Error) => {
        this.openapiRepository.deleteById(openapi._id);
        throw new Error('PipeContainer was not created.');
    });
    if (!pipeContainer || !pipeContainer._id) {
        this.openapiRepository.deleteById(openapi._id);
        throw new Error('PipeContainer was not created.');
    }
    openapi.name = pipeContainer.name;
    openapi.containerid = pipeContainer._id;
    openapi = await this.openapiRepository.create(openapi);

    pipeDeployed = {
        containerid: pipeContainer._id,
        deployed: {
            host: openapi.json.host,
            basePath: openapi.json.basePath,
            openapiid: openapi._id,
        }
    }

    pipeDeployed = await deployedController.create(pipeDeployed).catch((e: Error) => {
        containerController.deleteContainerFunctions(pipeContainer._id);
        this.openapiRepository.deleteById(openapi._id);
        throw new Error('PipeDeployed was not created.');
    });
    if (!pipeDeployed || !pipeDeployed._id) {
        containerController.deleteContainerFunctions(pipeContainer._id);
        this.openapiRepository.deleteById(openapi._id);
        throw new Error('PipeDeployed was not created.');
    }

    return openapi;
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

  @del('/openapi/{id}/all', {
    responses: {
        '200': {
            description: 'Openapi, PipeContainer, PipeDeployed, PipeFunction DELETE success count',
            content: {'application/json': {schema: CountSchema}},
        },
    },
  })
  async deleteContainerDeployedFunctions(@param.path.string('id') id: string): Promise<Count> {
    let containerRepository = await this.openapiRepository.container;
    let containerController = new PipeContainerController(containerRepository);

    let deployedRepository = await this.openapiRepository.deployed;
    let deployedController = new PipeDeployedController(deployedRepository);

    let openapi: Openapi = await this.openapiRepository.findById(id);

    await deployedController.delete({containerid: {like: openapi.containerid}});
    await this.openapiRepository.deleteById(id);
    return await containerController.deleteContainerFunctions(openapi.containerid);
  }
}
