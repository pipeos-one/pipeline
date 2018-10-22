import {OpenApiSpec} from '@loopback/openapi-v3-types';
import {Entity, model, property, hasOne} from '@loopback/repository';
import {PipeContainer} from './pipe-container.model';

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

  @hasOne()
  containerid: PipeContainer;

  constructor(data?: Partial<Openapi>) {
    super(data);
  }
}
