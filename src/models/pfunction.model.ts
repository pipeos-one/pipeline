import {Entity, Model, model, property, belongsTo} from '@loopback/repository';
import {PClass} from './pclass.model';
import {Graph} from './graph.model';
import {AbiFunction} from '../interfaces/gapi';
import {Natspec} from '../interfaces/natspec';

@model()
export class AbstractFunction extends Model {
    @property({
      type: 'string',
      required: true,
    })
    gapi: AbiFunction;

    @property({
      type: 'object',
      required: true,
    })
    natspec: Natspec;

    @property({
      type: 'string',
      required: true,
    })
    source: string;

    @property({
      type: 'string',
    })
    signature: string;
}

@model()
export class SolFunction extends AbstractFunction {
    @property({
        type: 'array',
        itemType: 'string',
    })
    chainids: string[];
}

@model()
export class JsFunction extends AbstractFunction {}

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class PFunction extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @belongsTo(() => PClass, {keyTo: '_id', keyFrom: 'classid'})
  classid: string;

  @belongsTo(() => Graph, {keyTo: '_id', keyFrom: 'graphid'})
  graphid: string;

  @property({
    type: 'object',
    required: true,
  })
  pfunction: SolFunction | JsFunction;

  @property({
    type: 'string',
  })
  uri?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  tags?: string[];

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  timestamp: Date;

  constructor(data?: Partial<PFunction>) {
    super(data);
  }
}
