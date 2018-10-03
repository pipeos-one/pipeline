import {Entity, model, property} from '@loopback/repository';

@model()
export class PipeFunction extends Entity {
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
  containerid: string;

  @property({
    type: 'string',
  })
  graphid: string;

  @property({
    type: 'string',
    required: true,
  })
  abi: string;

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
    required: true,
  })
  name: string;

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
