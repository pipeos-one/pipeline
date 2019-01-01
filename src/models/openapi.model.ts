import {OpenApiSpec} from '@loopback/openapi-v3-types';
import {Entity, model, property, hasOne} from '@loopback/repository';
import {PClass} from './pclass.model';

@model()
export class Openapi extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'object',
    required: true,
  })
  json: OpenApiSpec;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  uri?: string;

  // TODO hasOne?
  @property({
    type: 'string',
  })
  classid: string;

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  timestamp: Date;

  constructor(data?: Partial<Openapi>) {
    super(data);
  }
}
