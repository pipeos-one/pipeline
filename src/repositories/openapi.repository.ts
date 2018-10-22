import {
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {inject, Getter} from '@loopback/core';
import {Openapi} from '../models';
import {PipeContainerRepository} from './pipe-container.repository';
import {PipeDeployedRepository} from './pipe-deployed.repository';


export class OpenapiRepository extends DefaultCrudRepository<
  Openapi,
  typeof Openapi.prototype._id
> {
  public container: Promise<PipeContainerRepository>;
  public deployed: Promise<PipeDeployedRepository>;
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
    @repository.getter(PipeContainerRepository)
    getPipeContainerRepository: Getter<PipeContainerRepository>,
    @repository.getter(PipeDeployedRepository)
    getPipeDeployedRepository: Getter<PipeDeployedRepository>,
  ) {
    super(Openapi, datasource);
    this.container = getPipeContainerRepository();
    this.deployed =  getPipeDeployedRepository();
  }
}
