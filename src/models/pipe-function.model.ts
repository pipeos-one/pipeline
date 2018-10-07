import {Entity, model, property, belongsTo} from '@loopback/repository';
import {PipeContainer} from './pipe-container.model';
import {AbiFunction} from '../interfaces/abi';
import {DocMethod} from '../interfaces/soldocs';

@model()
export class PipeFunction extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  @belongsTo(() => PipeContainer, {keyTo: '_id'})
  containerid: string;

  @property({
    type: 'object',
  })
  graph: object;

  @property({
    type: 'object',
    required: true,
  })
  abiObj: AbiFunction;

  @property({
    type: 'object',
  })
  devdoc?: DocMethod;

  @property({
    type: 'object',
  })
  userdoc?: DocMethod;

  @property({
    type: 'string',
  })
  signature?: string;

  @property({
    type: 'string',
  })
  solsource: string;

  @property({
    type: 'string',
  })
  jssource: string;

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
    required: true,
    default: new Date(),
  })
  timestamp: string;

  constructor(data?: Partial<PipeFunction>) {
    super(data);
  }
}
