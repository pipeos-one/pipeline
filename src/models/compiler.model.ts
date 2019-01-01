import {Model, model, property, hasMany} from '@loopback/repository';

// TODO: take compiler model from solc
@model()
export class SolcCompilerSettings extends Model {
    @property({
      type: 'boolean',
    })
    optimize: boolean;
}

@model()
export class Compiler extends Model {
    @property({
      type: 'string',
    })
    name: string;

    @property({
      type: 'string',
    })
    version: string;  // e.g. 0.4.8-commit.60cc1668

    @property({
      type: 'object',
    })
    settings: SolcCompilerSettings;
}
