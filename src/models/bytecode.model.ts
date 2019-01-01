import {Model, model, property, hasMany} from '@loopback/repository';

@model()
export class Bytecode extends Model {
    @property({
      type: 'string',
    })
    bytecode: string;  // 0x...

    @property({
      type: 'array',
      itemType: 'object',
    })
    link_references: LinkReference[];

    @property({
      type: 'array',
      itemType: 'object',
    })
    link_dependencies: LinkValue[];
}

@model()
export class LinkReference extends Model {
    @property({
      type: 'array',
      itemType: 'number',
      required: true,
    })
    offsets: number[];

    @property({
      type: 'number',
      required: true,
    })
    length: number;

    @property({
      type: 'string',
      required: true,
    })
    name: string;
}

@model()
export class LinkValue extends Model {
    @property({
      type: 'array',
      itemType: 'number',
      required: true,
    })
    offsets: number[];

    @property({
      type: 'string',
      required: true,
    })
    type: string;  // (literal / reference)

    @property({
      type: 'string',
      required: true,
    })
    value: string;  // (byte string / ?package:contract name)
}
