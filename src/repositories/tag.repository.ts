import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Tag} from '../models';
import {inject} from '@loopback/core';


export class TagRepository extends DefaultCrudRepository<
  Tag,
  typeof Tag.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(Tag, datasource);
  }
}
