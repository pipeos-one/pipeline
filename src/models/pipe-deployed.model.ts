import {Entity, Model, model, property} from '@loopback/repository';

@model()
class Uri extends Model {
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
    openapiid?: string;
}

@model()
class EthUri extends Model {
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
}

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
    type: 'object',
    required: true,
  })
  deployed: Uri | EthUri;

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
