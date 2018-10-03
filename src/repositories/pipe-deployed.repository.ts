import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {PipeDeployed} from '../models';
import {inject} from '@loopback/core';


export class PipeDeployedRepository extends DefaultCrudRepository<
  PipeDeployed,
  typeof PipeDeployed.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(PipeDeployed, datasource);
  }
}
