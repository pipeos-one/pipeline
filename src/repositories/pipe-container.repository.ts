import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {PipeContainer} from '../models';
import {inject} from '@loopback/core';


export class PipeContainerRepository extends DefaultCrudRepository<
  PipeContainer,
  typeof PipeContainer.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(PipeContainer, datasource);
  }
}
