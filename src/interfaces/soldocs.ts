export interface DocParams {
    [key: string]: any;
}

export interface DevdocMethod {
    params: DocParams;
    return?: string;
    details?: string;
}

export interface UserMethod {
    params?: DocParams;
    notice?: string;
}

export interface DevdocMethods {
    [key: string]: DevdocMethod;
}

export interface UserMethods {
    [key: string]: UserMethod;
}

export interface Devdoc {
    title?: string;
    author?: string;
    notice?: string;
    dev?: string;
    methods: DevdocMethods;
}

export interface Userdoc {
    title?: string;
    author?: string;
    notice?: string;
    dev?: string;
    methods: UserMethods;
}
