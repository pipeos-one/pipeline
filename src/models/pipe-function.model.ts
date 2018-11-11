import {Entity, model, property, belongsTo} from '@loopback/repository';
import {PipeContainer} from './pipe-container.model';
import {AbiFunction} from '../interfaces/abi';
import {DevdocMethod, UserMethod} from '../interfaces/soldocs';

@model()
export class PipeFunction extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @belongsTo(() => PipeContainer, {keyTo: '_id', keyFrom: 'containerid'})
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
  devdoc?: DevdocMethod;

  @property({
    type: 'object',
  })
  userdoc?: UserMethod;

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
    generated: true,
    default: new Date(),
  })
  timestamp: Date;

  @property({
    type: 'array',
    itemType: 'string',
  })
  chainids: string[];

  constructor(data?: Partial<PipeFunction>) {
    super(data);
  }
}
