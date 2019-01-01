import {Entity, Model, model, property, hasMany} from '@loopback/repository';
import {PFunction} from './pfunction.model';
import {AbiFunction} from '../interfaces/gapi';
import {Natspec} from '../interfaces/natspec';
import {DStorage} from './storage.model';
import {Bytecode} from './bytecode.model';
import {Compiler} from './compiler.model';

@model()
export class AbstractClass extends Model {
    // TODO: gapi separate for classes
    @property({
      type: 'array',
      itemType: 'object',
    })
    gapi: AbiFunction[];

    @property({
      type: 'object',
    })
    natspec: Natspec;

    // TODO: remove devdoc & userdoc
    // These are only for inserting SolClasses from solc output
    // Maybe create another model for the controller input & a
    // wrapper for inserting the container
    @property({
      type: 'object',
    })
    devdoc: Natspec;

    @property({
      type: 'object',
    })
    userdoc: Natspec;

    @property({
      type: 'array',
      itemType: 'object',
    })
    sources: Source[];

    @property({
      type: 'string',
    })
    flatsource: string;

    @property({
      type: 'string',
    })
    flatsource_hash: string;
}

@model()
export class Source extends Model {
    @property({
      type: 'string',
      required: true,
    })
    relative_path: string;

    @property({
      type: 'string',
      required: true,
    })
    source: string;

    @property({
      type: 'object',
      required: true,
    })
    storage: DStorage;
}

@model()
export class SolClass extends AbstractClass {
    @property({
      type: 'string',
    })
    name: string;  // contract_name

    //  (previously bytecode: creation: runtime + constructor)
    // runtime bytecode on blockchain (deployedBytecode)
    @property({
      type: 'object',
    })
    deployment_bytecode: Bytecode;  // linked bytecode

    @property({
      type: 'object',
    })
    runtime_bytecode: Bytecode;  // unlinked bytecode

    @property({
      type: 'string',
    })
    metadata: string;  // TODO: ?

    @property({
      type: 'object',
      required: true,
    })
    compiler: Compiler;
}

@model()
export class PyClass extends AbstractClass {
    @property({
      type: 'string',
    })
    exported: string;
}

@model()
export class JsClass extends AbstractClass {
    @property({
      type: 'string',
    })
    exported: string;
}

@model()
export class OApiClass extends AbstractClass {
    @property({
      type: 'string',
    })
    exported: string;

    @property({
      type: 'string',
    })
    openapiid: string;
}

@model()
export class PClass extends Entity {
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
  name: string;  // contract_alias

  // TODO belongsTo Package
  @property({
    type: 'string',
  })
  packageid: string;

  @property({
    type: 'string',
  })
  module: string;

  @property({
    type: 'string',
  })
  type: string;  // sol / js / oapi / py / html

  @property({
    type: 'object',
  })
  pclass: SolClass | JsClass | OApiClass | PyClass;

  // TODO: hasMany PFunction of other types
  @property({
    type: 'array',
    itemType: 'string',
  })
  composite: string[];

  @property({
    type: 'string',
  })
  uri?: string;

  @hasMany(() => PFunction, {keyTo: 'classid'})
  pfunctions?: PFunction[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  tags: string[];

  // TODO remove?
  @property({
    type: 'string',
  })
  project?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  chainids: string[];

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  timestamp: Date;

  constructor(data?: Partial<PClass>) {
    super(data);
  }
}
