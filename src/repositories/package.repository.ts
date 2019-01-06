import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Package} from '../models';
import {inject} from '@loopback/core';


export class PackageRepository extends DefaultCrudRepository<
  Package,
  typeof Package.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(Package, datasource);
  }
}
