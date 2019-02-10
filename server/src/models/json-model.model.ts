import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class JsonModel extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id: string;

  @property({
    type: 'string',
    })
  validate?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  json?: string;

  @property({
    type: 'string',
  })
  yaml?: string;

  @property({
    type: 'string',
  })
  uri?: string;

  @property({
    type: 'date',
    generated: true,
    default: new Date(),
  })
  timestamp: Date;

  constructor(data?: Partial<JsonModel>) {
    super(data);
  }
}
