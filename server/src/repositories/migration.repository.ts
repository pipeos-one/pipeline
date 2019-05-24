import {PClass, PFunction} from '../models';
import {PClassRepository} from './pclass.repository';
import {PClassIRepository} from './pclassi.repository';
import {PFunctionRepository} from './pfunction.repository';
import {ProjectRepository} from './project.repository';
import {TagRepository} from './tag.repository';
import {
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {inject, Getter} from '@loopback/core';


export class MigrationPClassRepository extends DefaultCrudRepository<
  PClass,
  typeof PClass.prototype._id
> {
  public pclass: Promise<PClassRepository>;
  public pclassi: Promise<PClassIRepository>;
  public pfunctions: Promise<PFunctionRepository>;
  public project: Promise<ProjectRepository>;
  public tag: Promise<TagRepository>;
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
    @repository.getter(PClassRepository)
    getPClassRepository: Getter<PClassRepository>,
    @repository.getter(PClassIRepository)
    getPClassIRepository: Getter<PClassIRepository>,
    @repository.getter(PFunctionRepository)
    getPFunctionRepository: Getter<PFunctionRepository>,
    @repository.getter(ProjectRepository)
    getProjectRepository: Getter<ProjectRepository>,
    @repository.getter(TagRepository)
    getTagRepository: Getter<TagRepository>,
  ) {
    super(PClass, datasource);
    this.pclass =  getPClassRepository();
    this.pclassi =  getPClassIRepository();
    this.pfunctions = getPFunctionRepository();
    this.project = getProjectRepository();
    this.tag = getTagRepository();
  }
}
