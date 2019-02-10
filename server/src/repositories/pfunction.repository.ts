import {
    DefaultCrudRepository,
    juggler,
    BelongsToAccessor,
    repository,
} from '@loopback/repository';
import {Getter, inject} from '@loopback/context';
import {PFunction, PClass} from '../models';
import {PClassRepository} from '../repositories';


export class PFunctionRepository extends DefaultCrudRepository<
  PFunction,
  typeof PFunction.prototype._id
> {
  public readonly pclass: BelongsToAccessor<
    PClass,
    typeof PFunction.prototype._id
  >;

  constructor(
    @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
    @repository.getter('PClassRepository')
    getPClassRepository: Getter<PClassRepository>,
  ) {
    super(PFunction, datasource);
    this.pclass = this._createBelongsToAccessorFor(
      'pclassid',
      getPClassRepository,
    );
  }
}
