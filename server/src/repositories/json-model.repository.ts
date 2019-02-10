import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {JsonModel} from '../models';
import {inject} from '@loopback/core';


export class JsonModelRepository extends DefaultCrudRepository<
  JsonModel,
  typeof JsonModel.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(JsonModel, datasource);
  }
}
