import {OpenApiSpec} from '@loopback/openapi-v3-types';
import {
    PathItemObject,
    OperationObject,
    ResponseObject,
    ReferenceObject,
    ParameterObject,
} from 'openapi3-ts';
import {
    AbiFunctionInput,
    AbiFunctionOuput,
    AbiFunction,
    StateMutability,
} from '../interfaces/abi';
import {
    DocParams,
    Devdoc,
    Userdoc,
} from '../interfaces/soldocs';

export class OpenapiToGabi {
    openapi: OpenApiSpec;
    gabi: AbiFunction[];
    devdoc: Devdoc;
    userdoc: Userdoc;
    constructor(openapiSchema: OpenApiSpec) {
        this.openapi = openapiSchema;
        this.gabi = [];
        this.devdoc = {methods: {}};
        this.userdoc = {methods: {}};

        this.init();
    }

    init() {
        this.devdoc.title = this.openapi.info.title;
        if (this.openapi.info.contact) {
            this.devdoc.author = `${this.openapi.info.contact.name} - ${this.openapi.info.contact.email} - ${this.openapi.info.contact.url}`;
        }
        Object.keys(this.openapi.paths).forEach((name: string) => {
            let path: PathItemObject = this.openapi.paths[name];
            Object.keys(path).forEach((type: string) => {
                let content: OperationObject = path[type];
                this.methodToAbiFunction(name, type, content);
            });
        });
    }

    getSignature(name: string, types: string[]) {
        return `${name}(${types.join(',')})`;
    }

    methodToAbiFunction(name: string, type: string, content: OperationObject) {
        let inputs: AbiFunctionInput[] = [];
        let outputs: AbiFunctionOuput[] = [];
        let abiFunction: AbiFunction;
        let signature;
        let devdocParameters: DocParams = {};

        if (content.parameters) {
            content.parameters.forEach((parameter) => {
                inputs.push({
                    name: (<ParameterObject>parameter).name,
                    type: (<ParameterObject>parameter).type,
                    extra: {
                        openapi: {
                            required: (<ParameterObject>parameter).required,
                            in: (<ParameterObject>parameter).in,
                        }
                    }
                });
                devdocParameters[(<ParameterObject>parameter).name] = (<ParameterObject>parameter).description;
            });
        }

        Object.keys(content.responses).forEach((code: string) => {
            outputs.push({
                name: content.responses[code].description,
                type: content.responses[code].type,
            });
        });

        abiFunction = {
            name,
            type,
            inputs,
            outputs,
            constant: true,
            payable: false,
            stateMutability: StateMutability.VIEW,
        };

        this.gabi.push(abiFunction);

        signature = this.getSignature(abiFunction.name, abiFunction.inputs.map(input => {
            return input.type;
        }));

        this.userdoc.methods[signature] = {notice: content.description};
        this.devdoc.methods[signature] = {params: devdocParameters};
        if (content.responses['200']) {
            this.devdoc.methods[signature].return = content.responses['200'].description;
        }
    }
}
