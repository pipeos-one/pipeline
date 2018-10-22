import {OpenApiSpec} from '@loopback/openapi-v3-types';
import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<Openapi>) {
    super(data);
  }
}
