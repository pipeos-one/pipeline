import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Graph} from '../models';
import {inject} from '@loopback/core';


export class GraphRepository extends DefaultCrudRepository<
  Graph,
  typeof Graph.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(Graph, datasource);
  }
}
