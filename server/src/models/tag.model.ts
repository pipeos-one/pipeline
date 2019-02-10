import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Tag extends Entity {
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
  description?: string;

  @property({
    type: 'string',
  })
  uri?: string;

  @property({
    type: 'number',
    default: 0,
  })
  count: number;

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  timestamp: Date;

  constructor(data?: Partial<Tag>) {
    super(data);
  }
}
