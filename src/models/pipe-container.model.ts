import {Entity, model, property} from '@loopback/repository';

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
    type: 'string',
  })
  abi?: string;

  @property({
    type: 'string',
  })
  devdoc?: string;

  @property({
    type: 'string',
  })
  userdoc?: string;

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

  @property({
    type: 'array',
    itemType: 'string',
  })
  functions?: string[];

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
