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

export interface AbiFunctionInput {
    name: string;
    type: string;
    indexed?: boolean;
    extra?: AbiExtra;
}

export interface AbiFunctionOutput {
    name: string;
    type: string;
    components?: AbiFunctionOutput;
    extra?: AbiExtra;
}

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
