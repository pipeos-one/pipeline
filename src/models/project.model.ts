import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Project extends Entity {
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
  icon?: string;

  @property({
    type: 'string',
  })
  uri?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
  })
  github?: string;

  @property({
    type: 'number',
    default: 0,
  })
  count: number;

  constructor(data?: Partial<Project>) {
    super(data);
  }
}
