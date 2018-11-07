import {PipeContainer, PipeFunction} from '../models';
import {PipeFunctionRepository} from './pipe-function.repository';
import {
  DefaultCrudRepository,
  juggler,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {inject, Getter} from '@loopback/core';


export class PipeContainerRepository extends DefaultCrudRepository<
  PipeContainer,
  typeof PipeContainer.prototype._id
> {
  public pipefunctions: Promise<PipeFunctionRepository>;
  public functions: HasManyRepositoryFactory<PipeFunction, typeof PipeContainer.prototype._id>;
  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
    @repository.getter(PipeFunctionRepository)
    getPipeFunctionRepository: Getter<PipeFunctionRepository>,
  ) {
    super(PipeContainer, datasource);
    this.functions = this._createHasManyRepositoryFactoryFor(
      'functions',
      getPipeFunctionRepository,
    );
    this.pipefunctions = getPipeFunctionRepository();

  }
}
