import {PClass, PFunction} from '../models';
import {PFunctionRepository} from './pfunction.repository';
import {PClassIRepository} from './pclassi.repository';
import {
  DefaultCrudRepository,
  juggler,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {inject, Getter} from '@loopback/core';


export class PClassRepository extends DefaultCrudRepository<
  PClass,
  typeof PClass.prototype._id
> {
  public pfunctions: Promise<PFunctionRepository>;
  public functions: HasManyRepositoryFactory<PFunction, typeof PClass.prototype._id>;
  public pclassi: Promise<PClassIRepository>;
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
    @repository.getter(PFunctionRepository)
    getPFunctionRepository: Getter<PFunctionRepository>,
    @repository.getter(PClassIRepository)
    getPClassIRepository: Getter<PClassIRepository>,
  ) {
    super(PClass, datasource);
    this.functions = this._createHasManyRepositoryFactoryFor(
      'pfunctions',
      getPFunctionRepository,
    );
    this.pfunctions = getPFunctionRepository();
    this.pclassi =  getPClassIRepository();
  }
}
