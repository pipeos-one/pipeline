import {Natspec} from './natspec';
import {AbiFunction} from './gapi';

export interface Links {
    [key: string]: any;
}

export interface PackageMeta {
    authors: string[];
    license: string;
    description: string;
    keywords: string[];
    links: Links;
}

export interface Sources {
    [key: string]: string;
}

export interface LinkReference {
    offsets: number[];
    length: number;
    name: string;
}

export interface LinkValue {
    offsets: number[];
    type: string;
    value: string;
}

export interface Bytecode {
    bytecode: string;
    link_references: LinkReference[];
    link_dependencies: LinkValue[];
}

export interface CompilerInputOutputJSON {
    language: string;
    sources: object;
    settings: object;
}

export interface Compiler {
    name: string;
    version: string;
    settings: CompilerInputOutputJSON;
}

export interface ContractType {
    contract_name: string;
    deployment_bytecode: Bytecode;
    runtime_bytecode: Bytecode;
    abi: AbiFunction[];
    natspec: Natspec;
    compiler: Compiler;
}

export interface ContractTypes {
    [key: string]: ContractType;
}

export interface ContractInstance {
    contract_type: string;
    address: string;
    transaction: string;
    block: string;
    runtime_bytecode: Bytecode;
    compiler: Compiler;
    link_dependencies: LinkValue[];
}

export interface Deployment {
    [key: string]: ContractInstance;
}

export interface Deployments {
    [key: string]: Deployment;
}

export interface BuildDependencies {
    [key: string]: string;
}

export interface EthPMPackageJson {
    manifest_version: string;
    package_name: string;
    version: string;
    meta: PackageMeta;
    sources: Sources;
    contract_types: ContractTypes;
    deployments: Deployments;
    build_dependencies: BuildDependencies;
}
