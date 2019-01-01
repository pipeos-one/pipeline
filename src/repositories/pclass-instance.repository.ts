import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {PClassI} from '../models';
import {inject} from '@loopback/core';


export class PClassIRepository extends DefaultCrudRepository<
  PClassI,
  typeof PClassI.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(PClassI, datasource);
  }
}
