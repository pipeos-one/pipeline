interface DocParams {
    [key: string]: any;
}

interface DocMethod {
    params: DocParams;
    return?: string;
    notice?: string;
}

interface DocMethods {
    [key: string]: DocMethod;
}

interface Devdoc {
    title?: string;
    author?: string;
    notice?: string;
    dev?: string;
    methods: DocMethods;
}

interface Userdoc {
    title?: string;
    author?: string;
    notice?: string;
    dev?: string;
    methods: DocMethods;
}

export {
    DocParams,
    DocMethod,
    DocMethods,
    Devdoc,
    Userdoc,
}
