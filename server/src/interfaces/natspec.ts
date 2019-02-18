// import {SignatureData} from './gapi';

export interface DocParams {
    [key: string]: any;
}

export interface NatspecMethod {
    params: DocParams;
    return?: string;
    details?: string;
    notice?: string;
}

// TODO: use [key: SignatureData]
export interface NatspecMethods {
    [key: string]: NatspecMethod;
}

export interface Natspec {
    title?: string;
    author?: string;
    notice?: string;
    dev?: string;
    methods: NatspecMethods;
}

export const EMPTY_NATSPEC = {methods: {}};
