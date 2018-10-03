import {Entity, model, property} from '@loopback/repository';

@model()
export class PipeDeployed extends Entity {
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
    required: true,
  })
  ethaddress: string;

  @property({
    type: 'string',
    required: true,
  })
  chainid: string;

  @property({
    type: 'string',
  })
  bytecode?: string;

  @property({
    type: 'date',
    required: true,
    default: new Date(),
  })
  timestamp: string;

  constructor(data?: Partial<PipeDeployed>) {
    super(data);
  }
}
