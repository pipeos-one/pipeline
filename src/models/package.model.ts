import {Entity, Model, model, property, hasMany} from '@loopback/repository';
import {DStorage} from './storage.model';

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
export class Deployment extends Model {
    @property({
       type: 'string',
    })
    chain_id: string;

    @property({
       type: 'string',
    })
    genesis_hash: string;

    @property({
       type: 'string',
    })
    block_hash: string;

    @property({
       type: 'string',
    })
    bip122_uri: string;

    // TODO: hasOne
    @property({
       type: 'string',
    })
    instanceid: string;  // PClassI _id
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

    // @hasMany(() => PClass, {keyTo: 'classid'})
    // pfunctions?: PClass[];

    // TODO: hasMany
    @property({
        type: 'array',
        itemType: 'string',
        required: true,
    })
    contracts: string[];  // PClass _ids

    @property({
       type: 'Deployment[]',
       required: true,
    })
    deployments: Deployment[];
}

@model()
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
