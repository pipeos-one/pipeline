import {Entity, Model, model, property, belongsTo} from '@loopback/repository';
import {Package} from './package.model';
import {PClass} from './pclass.model';
import {Bytecode} from './bytecode.model';
import {Compiler} from './compiler.model';

@model()
export class OApiInstance extends Model {
    @property({
      type: 'string',
      required: true,
    })
    host: string;

    @property({
      type: 'string',
      required: true,
    })
    basePath: string;

    @property({
      type: 'string',
    })
    oapiid?: string;
}

@model()
export class SolInstance extends Model {
    @property({
      type: 'string',
    })
    instance_name: string;  // ethpm's Contract Instance Name

    @property({
      type: 'string',
      required: true,
    })
    address: string;

    @property({
      type: 'string',
    })
    transaction?: string;  // 0x

    @property({
      type: 'string',
    })
    block?: string;  // 0x

    // TODO: (? + constructor args?)
    @property({
      type: 'object',
    })
    runtime_bytecode: Bytecode;  // unlinked bytecode

    @property({
      type: 'object',
    })
    deployment_bytecode: Bytecode;  // unlinked bytecode

    @property({
      type: 'string',
    })
    constructorArgs?: string;  // 0x

    @property({
      type: 'object',
    })
    compiler: Compiler;

    @property({
      type: 'string',
      required: true,
    })
    chainid: string;

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
}

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class PClassI extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  // @belongsTo(() => Package, {keyTo: '_id', keyFrom: 'packageid'})
  // packageid: string;
  //
  // @belongsTo(() => PClass, {keyTo: '_id', keyFrom: 'pclassid'})
  // pclassid: string;

  @property({
     type: 'string',
  })
  packageid: string;

  @property({
     type: 'string',
  })
  pclassid: string;

  @property({
    type: 'object',
    required: true,
  })
  instance: SolInstance | OApiInstance;

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  timestamp: Date;

  constructor(data?: Partial<PClassI>) {
    super(data);
  }
}
