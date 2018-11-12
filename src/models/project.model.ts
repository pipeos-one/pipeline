import {Entity, model, property} from '@loopback/repository';

@model()
export class Project extends Entity {
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

  constructor(data?: Partial<Project>) {
    super(data);
  }
}
