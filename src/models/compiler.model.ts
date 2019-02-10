import {Model, model, property, hasMany} from '@loopback/repository';

@model()
export class SolcOptimizer extends Model {
    @property({
      type: 'boolean',
    })
    enabled: boolean;

    @property({
      type: 'number',
    })
    runs: number;
}

@model()
export class CompilationTarget extends Model {
    @property({
      type: 'string',
      required: true,
    })
    filePath: string;

    @property({
      type: 'string',
      required: true,
    })
    contractName: string;
}

// TODO: take compiler model from solc
@model()
export class SolcCompilerSettings extends Model {
    @property({
      type: 'object',
    })
    compilationTarget: CompilationTarget;

    @property({
      type: 'string',
    })
    evmVersion: string;

    @property({
      type: 'any',
    })
    libraries: any;

    @property({
      type: 'string',
    })
    remappings: string[];

    @property({
      type: 'object',
    })
    optimizer: SolcOptimizer;

    // Allow additional data
    // [prop: string]: any;
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
