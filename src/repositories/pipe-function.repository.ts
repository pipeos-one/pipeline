import {
    DefaultCrudRepository,
    juggler,
    BelongsToAccessor,
    repository,
} from '@loopback/repository';
import {Getter, inject} from '@loopback/context';
import {PipeFunction, PipeContainer} from '../models';
import {PipeContainerRepository} from '../repositories';


export class PipeFunctionRepository extends DefaultCrudRepository<
  PipeFunction,
  typeof PipeFunction.prototype._id
> {
  public readonly pipeContainer: BelongsToAccessor<
    PipeContainer,
    typeof PipeFunction.prototype._id
  >;

  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
    @repository.getter('PipeContainerRepository')
    getPipeContainerRepository: Getter<PipeContainerRepository>,
  ) {
    super(PipeFunction, datasource);
    this.pipeContainer = this._createBelongsToAccessorFor(
      'containerid',
      getPipeContainerRepository,
    );
  }
}
