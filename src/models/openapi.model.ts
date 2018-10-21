import {Entity, model, property} from '@loopback/repository';

@model()
export class Openapi extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
  })
  _id: string;

  @property({
    type: 'string',
    required: true,
  })
  json: string;

  @property({
    type: 'string',
  })
  name?: string;

  constructor(data?: Partial<Openapi>) {
    super(data);
  }
}
