import {Entity, Model, model, property, belongsTo} from '@loopback/repository';
import {PipeContainer} from './pipe-container.model';

@model()
export class Uri extends Model {
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
export class EthUri extends Model {
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
    constructorArgs?: string;
}

@model()
export class PipeDeployed extends Entity {
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
    required: true,
  })
  deployed: Uri | EthUri;

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  timestamp: Date;

  constructor(data?: Partial<PipeDeployed>) {
    super(data);
  }
}
