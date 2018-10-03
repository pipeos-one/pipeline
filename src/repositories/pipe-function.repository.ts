import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {PipeFunction} from '../models';
import {inject} from '@loopback/core';


export class PipeFunctionRepository extends DefaultCrudRepository<
  PipeFunction,
  typeof PipeFunction.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(PipeFunction, datasource);
  }
}
