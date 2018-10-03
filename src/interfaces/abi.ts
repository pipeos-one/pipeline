interface AbiFunctionInput {
    name: string;
    type: string;
    indexed?: boolean;
}

interface AbiFunctionOuput {
    name: string;
    type: string;
}

interface AbiFunction {
    constant: boolean;
    name: string;
    payable: boolean;
    stateMutability: string;
    type: string;
    anonymous?: boolean;
    inputs: AbiFunctionInput[];
    outputs: AbiFunctionOuput[];

}

export {AbiFunctionInput, AbiFunctionOuput, AbiFunction}
