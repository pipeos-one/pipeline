import {Entity, Model, model, property, hasMany} from '@loopback/repository';
import {DStorage} from './storage.model';
import {PClass} from './pclass.model';
import {PClassI} from './pclass-instance.model';

@model()
export class EthPMMeta extends Model {
    @property({
        type: 'array',
        itemType: 'string',
    })
    authors: string[];

    @property({
       type: 'string',
    })
    license: string;

    @property({
       type: 'string',
    })
    description: string;

    @property({
        type: 'array',
        itemType: 'string',
    })
    keywords: string[];

    @property({
       type: 'object',
    })
    links: object;
}

@model()
export class EthPMPackage extends Model {
    @property({
       type: 'string',
       required: true,
    })
    manifest_version: string;

    @property({
       type: 'string',
       required: true,
    })
    package_name: string;

    @property({
       type: 'string',
       required: true,
    })
    version: string;

    @property({
       type: 'object',
    })
    meta: EthPMMeta;

    // @hasMany(() => PClass, {keyTo: 'packageid'})
    // contracts: PClass[];
    //
    // @hasMany(() => PClassI, {keyTo: 'packageid'})
    // deployments: PClassI[];

    @property({
        type: 'array',
        itemType: 'string',
        required: true,
    })
    contracts: string[];  // PClass _ids

    @property({
        type: 'array',
        itemType: 'string',
        required: true,
    })
    deployments: string[];  // PClassI _ids
}

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Package extends Entity {
    @property({
       type: 'string',
       id: true,
       generated: true,
    })
    _id: string;

    @property({
       type: 'string',
       required: true,
    })
    package_json: string;

    @property({
       type: 'object',
       required: true,
    })
    storage: DStorage;

    @property({
       type: 'object',
    })
    package: EthPMPackage;

    @property({
        type: 'array',
        itemType: 'string',
    })
    modules: string[];

    constructor(data?: Partial<Package>) {
      super(data);
    }
}
