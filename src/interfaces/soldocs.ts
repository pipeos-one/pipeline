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
    methods: DocMethods;
}

interface Userdoc {
    methods: DocMethods;
}

export {
    DocParams,
    DocMethod,
    DocMethods,
    Devdoc,
    Userdoc,
}
