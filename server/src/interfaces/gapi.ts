import {SolType} from './soltypes';

export type SignatureData = string;

export enum StateMutability {
    PURE = 'pure',
    VIEW = 'view',
    NONPAYABLE = 'nonpayable',
    PAYABLE = 'payable'
}

export enum AbiType {
    FUNCTION = 'function',
    EVENT = 'event',
    CONSTRUCTOR = 'constructor',
    FALLBACK = 'fallback',
}

export interface AbiExtra {
    [key: string]: any;
}

export interface AbiFunctionIO {
    name: string;
    type: SolType;
    components?: AbiFunctionIO[];
    extra?: AbiExtra;
}

export interface AbiFunctionInput extends AbiFunctionIO {
    indexed?: boolean;
}

export interface AbiFunctionOutput extends AbiFunctionIO {}

export interface AbiFunction {
    constant: boolean;
    name: string;
    payable: boolean;
    stateMutability: StateMutability;
    type: string;
    anonymous?: boolean;
    inputs: AbiFunctionInput[];
    outputs: AbiFunctionOutput[];
    extra?: AbiExtra;
}
