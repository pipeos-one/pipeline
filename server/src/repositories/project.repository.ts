import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Project} from '../models';
import {inject} from '@loopback/core';


export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype._id
> {
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
  ) {
    super(Project, datasource);
  }
}
