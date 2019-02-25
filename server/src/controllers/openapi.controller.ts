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
import {Openapi, PClass} from '../models';
import {OpenapiRepository} from '../repositories';
import {PClassController, PClassIController} from '../controllers';
import {OpenapiToGapi} from '../utils/openapi_to_gapi';

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
    let pclass: any;
    let pclassi: any;
    let flatsource: string;

    let pclassRepository = await this.openapiRepository.pclass;
    let pclassController = new PClassController(pclassRepository);

    let pclassiRepository = await this.openapiRepository.pclassi;
    let pclassiController = new PClassIController(pclassiRepository);

    let gapi = new OpenapiToGapi(openapi.json);
    flatsource = Object.keys(gapi.sourceByFunctionName).map((key: string) => {
        return `
const ${key} = ${gapi.sourceByFunctionName[key]}`;
    }).join('');

    pclass = {
        name: gapi.natspec.title || 'unknown',
        type: 'js',
        pclass: {
            gapi: gapi.gapi,
            natspec: gapi.natspec,
            openapiid: openapi._id,
            flatsource,
            sourceByFunctionName: gapi.sourceByFunctionName,
        },
        tags: ['openapi'],
    }
    pclass = await pclassController.createFunctions(pclass).catch((error: Error) => {
        console.log('PClass was not created.');
        throw error;
    });
    if (!pclass || !pclass._id) {
        this.openapiRepository.deleteById(openapi._id);
        throw new Error('PClass was not created.');
    }
    openapi.name = pclass.name;
    openapi.pclassid = pclass._id;
    openapi = await this.openapiRepository.create(openapi);

    pclassi = {
        pclassid: pclass._id,
        pclassi: {
            host: openapi.json.host,
            basePath: openapi.json.basePath,
            openapiid: openapi._id,
        }
    }

    pclassi = await pclassiController.create(pclassi).catch((e: Error) => {
        pclassController.deletePClassFunctions(pclass._id);
        this.openapiRepository.deleteById(openapi._id);
        throw new Error('PClassI was not created.');
    });
    if (!pclassi || !pclassi._id) {
        pclassController.deletePClassFunctions(pclass._id);
        this.openapiRepository.deleteById(openapi._id);
        throw new Error('PClassI was not created.');
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
            description: 'Openapi, PClass, PClassI, PFunction DELETE success count',
            content: {'application/json': {schema: CountSchema}},
        },
    },
  })
  async deletePClassFunctionsPClassI(@param.path.string('id') id: string): Promise<Count> {
    let pclassRepository = await this.openapiRepository.pclass;
    let pclassController = new PClassController(pclassRepository);

    let pclassiRepository = await this.openapiRepository.pclassi;
    let pclassiController = new PClassIController(pclassiRepository);

    let openapi: Openapi = await this.openapiRepository.findById(id);

    await pclassiController.delete({pclassid: {like: openapi.pclassid}});
    await this.openapiRepository.deleteById(id);
    return await pclassController.deletePClassFunctions(openapi.pclassid);
  }
}
