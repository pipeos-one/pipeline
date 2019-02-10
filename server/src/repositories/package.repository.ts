import {DefaultCrudRepository, juggler, repository} from '@loopback/repository';
import {inject, Getter} from '@loopback/core';
import {Package} from '../models';
import {PClassRepository} from './pclass.repository';
import {PClassIRepository} from './pclassi.repository';

export class PackageRepository extends DefaultCrudRepository<
    Package,
    typeof Package.prototype._id
> {
    public pclass: Promise<PClassRepository>;
    public pclassi: Promise<PClassIRepository>;
    constructor(
        @inject('datasources.atlasmongo') protected datasource: juggler.DataSource,
        @repository.getter(PClassRepository)
            getpclassRepository: Getter<PClassRepository>,
        @repository.getter(PClassIRepository)
            getpclassiRepository: Getter<PClassIRepository>,
    ) {
        super(Package, datasource);
        this.pclass = getpclassRepository();
        this.pclassi = getpclassiRepository();
  }
}
