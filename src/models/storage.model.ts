import {Model, model, property, belongsTo} from '@loopback/repository';
import {DStorageType} from '../interfaces';

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
    type: DStorageType;
}
