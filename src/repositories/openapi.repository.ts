import {
  DefaultCrudRepository,
  juggler,
  repository,
} from '@loopback/repository';
import {inject, Getter} from '@loopback/core';
import {Openapi} from '../models';
import {PClassRepository} from './pclass.repository';
import {PClassIRepository} from './pclass-instance.repository';


export class OpenapiRepository extends DefaultCrudRepository<
  Openapi,
  typeof Openapi.prototype._id
> {
  public pclass: Promise<PClassRepository>;
  public pclassi: Promise<PClassIRepository>;
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
    @repository.getter(PClassRepository)
    getPClassRepository: Getter<PClassRepository>,
    @repository.getter(PClassIRepository)
    getPClassIRepository: Getter<PClassIRepository>,
  ) {
    super(Openapi, datasource);
    this.pclass = getPClassRepository();
    this.pclassi =  getPClassIRepository();
  }
}
