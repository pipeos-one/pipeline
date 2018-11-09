import {OpenApiSpec} from '@loopback/openapi-v3-types';
import {
    PathItemObject,
    OperationObject,
    ResponseObject,
    ReferenceObject,
    ParameterObject,
    ComponentsObject,
    SchemaObject,
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
            this.devdoc.author = Object.entries(this.openapi.info.contact).map((entry) => entry[1]).join(' - ');
        }
        Object.keys(this.openapi.paths).forEach((name: string) => {
            let path: PathItemObject = this.openapi.paths[name];
            Object.keys(path).forEach((type: string) => {
                let content: OperationObject = path[type];
                this.methodToAbiFunction(name, type, content, this.openapi.components);
            });
        });
    }

    getSignature(name: string, types: string[]) {
        return `${name}(${types.join(',')})`;
    }

    methodToAbiFunction(name: string, type: string, content: OperationObject, components: ComponentsObject | undefined) {
        console.log('methodToAbiFunction', name, type, content);
        let inputs: AbiFunctionInput[] = [];
        let outputs: AbiFunctionOuput[] = [];
        let abiFunction: AbiFunction;
        let signature;
        let devdocParameters: DocParams = {};

        if (content.parameters) {
            content.parameters.forEach((parameter) => {
                let extra: any = {
                    openapi: {
                        required: (<ParameterObject>parameter).required,
                        in: (<ParameterObject>parameter).in,
                    }
                }
                let schema: SchemaObject | ReferenceObject | undefined = (<ParameterObject>parameter).schema;
                let type = (<SchemaObject>schema).format
                    || (<SchemaObject>schema).type
                    || 'any';

                if (schema && schema.$ref && components && components.schemas) {
                    type = schema.$ref.replace('#/components/', '').split('/')[1];
                    extra.openapi[type] = components.schemas[type];
                }
                inputs.push({
                    name: (<ParameterObject>parameter).name,
                    type,
                    extra,
                });
                devdocParameters[(<ParameterObject>parameter).name] = (<ParameterObject>parameter).description;
            });
        }

        Object.keys(content.responses).forEach((code: string) => {
            let extra: any = {
                openapi: {
                    code,
                }
            }
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
                name: 'Code_' + code,
                type: type || '',
                extra,
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
