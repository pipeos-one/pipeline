import {Openapi} from '../models';
import {
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {inject, Getter} from '@loopback/core';


export class OpenapiRepository extends DefaultCrudRepository<
  Openapi,
  typeof Openapi.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(Openapi, datasource);
  }
}
