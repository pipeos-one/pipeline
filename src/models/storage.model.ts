import {Model, model, property, belongsTo} from '@loopback/repository';

@model()
export class DStorage extends Model {
    @property({
       type: 'string',
       required: true,
    })
    hash: string;

    @property({
       type: 'string',
       required: true,
    })
    type: string;  // ipfs, bzz
}
