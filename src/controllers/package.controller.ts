import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  FilterBuilder,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Package, DStorage} from '../models';
import {PackageRepository} from '../repositories';
import {DStorageController} from './dstorage.controller';
import {DStorageType} from '../interfaces';

export class PackageController {
  constructor(
    @repository(PackageRepository)
    public packageRepository : PackageRepository,
  ) {}

  @post('/package', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: {'x-ts-type': Package}}},
      },
    },
  })
  async create(@requestBody() ppackage: Package): Promise<Package> {
    return await this.packageRepository.create(ppackage);
  }

  @get('/package/count', {
    responses: {
      '200': {
        description: 'Package model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Package)) where?: Where,
  ): Promise<Count> {
    return await this.packageRepository.count(where);
  }

  @get('/package', {
    responses: {
      '200': {
        description: 'Array of Package model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Package}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Package)) filter?: Filter,
  ): Promise<Package[]> {
    return await this.packageRepository.find(filter);
  }

  @patch('/package', {
    responses: {
      '200': {
        description: 'Package PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() ppackage: Package,
    @param.query.object('where', getWhereSchemaFor(Package)) where?: Where,
  ): Promise<Count> {
    return await this.packageRepository.updateAll(ppackage, where);
  }

  @get('/package/{id}', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: {'x-ts-type': Package}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Package> {
    return await this.packageRepository.findById(id);
  }

  @patch('/package/{id}', {
    responses: {
      '204': {
        description: 'Package PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() ppackage: Package,
  ): Promise<void> {
    await this.packageRepository.updateById(id, ppackage);
  }

  @put('/package/{id}', {
    responses: {
      '204': {
        description: 'Package PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ppackage: Package,
  ): Promise<void> {
    await this.packageRepository.replaceById(id, ppackage);
  }

  @del('/package/{id}', {
    responses: {
      '204': {
        description: 'Package DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.packageRepository.deleteById(id);
  }

  @get('/package/storage/{type}/{hash}', {
    responses: {
      '200': {
        description: 'Package model instance',
        content: {'application/json': {schema: {'x-ts-type': Package}}},
      },
    },
})
  async tryInsertFromStorage(
    @param.path.string('type') type: DStorageType,
    @param.path.string('hash') hash: string,
  ): Promise<Package> {
    let ppackage;

    ppackage = await this.packageRepository.find(
        JSON.parse(JSON.stringify({ where: {
            'storage.hash': hash,
            'storage.type': type
        }}))
    );

    if (ppackage.length > 0) {
        return ppackage[0];
    }
    return await this.insertFromStorage(type, hash);
  }

  async insertFromStorage(type: DStorageType, hash: string): Promise<Package> {
    let dstorage, package_json: any, ppackage;

    dstorage = new DStorageController();
    package_json = await dstorage.get(type, hash);
    ppackage = {
        package_json: JSON.stringify(package_json),
        storage: {type, hash},
    };
    return await this.packageRepository.create(ppackage);
  }
}
