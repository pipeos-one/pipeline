import {Entity, model, property, hasMany} from '@loopback/repository';
import {PipeFunction} from './pipe-function.model';
import {AbiFunction} from '../interfaces/abi';
import {Devdoc, Userdoc} from '../interfaces/soldocs';

@model()
export class PipeContainer extends Entity {
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
  name: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  abi?: AbiFunction[];

  @property({
    type: 'object',
  })
  devdoc?: Devdoc;

  @property({
    type: 'object',
  })
  userdoc?: Userdoc;

  @property({
    type: 'string',
  })
  bytecode?: string;

  @property({
    type: 'string',
  })
  keccak256?: string;

  @property({
    type: 'string',
    required: true,
  })
  solsource: string;

  @property({
    type: 'string',
  })
  jssource?: string;

  @property({
    type: 'string',
  })
  uri?: string;

  @hasMany(() => PipeFunction, {keyTo: 'containerid'})
  functions?: PipeFunction[];

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

  constructor(data?: Partial<PipeContainer>) {
    super(data);
  }
}
