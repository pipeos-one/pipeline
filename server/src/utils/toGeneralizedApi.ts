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
} from '../interfaces/gapi';
import {
    DocParams,
    Natspec,
} from '../interfaces/natspec';
// TODO: fix natspec
export class OpenapiToGapi {
    openapi: OpenApiSpec;
    gapi: AbiFunction[];
    natspec: Natspec;
    constructor(openapiSchema: OpenApiSpec) {
        this.openapi = openapiSchema;
        this.gapi = [];
        this.natspec = {methods: {}};

        this.init();
    }

    init() {
        this.natspec.title = this.openapi.info.title;
        if (this.openapi.info.contact) {
            this.natspec.author = `${this.openapi.info.contact.name} - ${this.openapi.info.contact.email} - ${this.openapi.info.contact.url}`;
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
            let type: string = '';
            if (content.responses[code].schema) {
                if (content.responses[code].schema.type) {
                    type = content.responses[code].schema.type;
                } else if (content.responses[code].schema['$ref']) {
                    let path: string[] = content.responses[code].schema['$ref']
                        .split('/')
                        .slice(1);
                    let pointer: any = this.openapi;

                    for (let item of path) {
                        pointer = pointer[item];
                    }
                    type = pointer.type;
                }
            }
            outputs.push({
                name: content.responses[code].description
                    .split(' ')
                    .map((word: string) => word[0].toUpperCase() + word.substring(1))
                    .join(''),
                type: type || '',
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

        this.gapi.push(abiFunction);

        signature = this.getSignature(abiFunction.name, abiFunction.inputs.map(input => {
            return input.type;
        }));

        this.natspec.methods[signature] = {
            notice: content.description,
            params: devdocParameters,
        };
        if (content.responses['200']) {
            this.natspec.methods[signature].return = content.responses['200'].description;
        }
    }
}
