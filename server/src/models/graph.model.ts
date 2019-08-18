import {Entity, Model, model, property, hasMany} from '@loopback/repository';
import {PFunction} from './pfunction.model';
import {DStorage} from './storage.model';

@model({
  settings: {
    strictObjectIDCoercion: true,
  },
})
export class Graph extends Entity {
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
    json: string;

    @property({
       type: 'string',
       required: true,
    })
    name: string;

    @property({
       type: 'string',
       required: true,
    })
    markdown: string;

    // @property({
    //    type: 'object',
    //    // required: true,
    // })
    // storage: DStorage;

    constructor(data?: Partial<Graph>) {
      super(data);
    }
}
