import {OpenApiSpec} from '@loopback/openapi-v3-types';
import {
    PathItemObject,
    OperationObject,
    ResponseObject,
    ReferenceObject,
    ParameterObject,
} from 'openapi3-ts';
import {
    AbiFunctionIO,
    AbiFunctionInput,
    AbiFunctionOutput,
    AbiFunction,
    StateMutability,
    SignatureData,
    AbiType,
} from '../interfaces/gapi';
import {
    DocParams,
    Natspec,
} from '../interfaces/natspec';
import {SolType} from '../interfaces/soltypes';

export const OapiToSolType: any = {
    integer: {
        int32: 'int32',
        int64: 'int64',
        uint32: 'uint32',
        uint64: 'uint64',
        undefined: 'int',
    },
    number: {
        float: 'fixed',
        double: 'fixed',
    },
    string: {
        byte: 'bytes1',
        binary: 'bytes',
        date: 'string',  // TODO Unix time?
        'date-time': 'string',  // TODO Unix time?
        password: 'string',
        undefined: 'string',
    },
    boolean: {
        undefined: 'bool',
    },
    file: {
        undefined: 'bytes',
    },
}

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
            Object.keys(path).forEach((method: string) => {
                let content: OperationObject = path[method];
                this.methodToAbiFunction(name, method, content);
            });
        });
    }

    getGapiNameFromOapi(name: string, method: string): string {
        return `${name}_${method}`;
    }

    getSignature(name: string, types: SolType[]): SignatureData {
        return `${name}(${types.join(',')})`;
    }

    getNameFromDescription(description: string | undefined): string {
        if (!description) return '';
        return description.split(' ')
            .map((word: string) => word[0].toUpperCase() + word.substring(1))
            .join('');
    }

    // There should be no $ref inside
    getGapiType(obj: any): SolType {
        let type: any = '';
        let objClone = JSON.parse(JSON.stringify(obj));
        while (objClone.type === 'array') {
            type += '[]';
            objClone = objClone.items;
        }
        type = OapiToSolType[objClone.type][objClone.format] + type;
        return type;
    }

    getComponentsFromSchemaProperties(properties: any): AbiFunctionIO[] {
        let props: any[] = [];
        Object.keys(properties).forEach((prop: string) => {
            if (properties[prop] === '$ref') {
                props = props.concat(
                    this.getComponentsFromAllSchemaProperties(properties[prop])
                );
            } else {
                props.push({
                    name: prop,
                    type: this.getGapiType(properties[prop]),
                });
            }
        });
        return props;
    }

    getComponentsFromAllSchemaProperties(schema: any): AbiFunctionIO[] {
        let props: any = [];

        // Happens for items, allOf & properties
        if (schema['$ref']) {
            return this.getComponentsFromAllSchemaProperties(
                this.getReference(schema['$ref']).schema
            );
        }
        if (schema.properties) {
            props = props.concat(this.getComponentsFromSchemaProperties(schema.properties));
        }

        if (schema.additionalProperties) {
            props = props.concat(this.getComponentsFromSchemaProperties(schema.additionalProperties));
        }

        if (schema.allOf) {
            schema.allOf.forEach((subschema: any) => {
                props = props.concat(this.getComponentsFromAllSchemaProperties(subschema));
            });
        }

        return props;
    }

    getOutputFromResponseSchema(schema: any): AbiFunctionOutput {
        let type: any, components: AbiFunctionIO[];

        if (schema.type === 'array') {
            type = 'tuple[]';
            components = this.getComponentsFromAllSchemaProperties(schema.items);
        } else {
            type = 'tuple';
            components = this.getComponentsFromAllSchemaProperties(schema);
        }
        return {
            name: schema.name,
            type,
            components,
        }
    }

    getReference(reference: string): any {
        let path: string[];
        let pointer: any, name: string = '';

        path = reference.split('/').slice(1);
        pointer = this.openapi;

        for (let item of path) {
            pointer = pointer[item];
            name = item;
        }
        return {schema: pointer, name};
    }

    getOutputFromResponse(response: any): AbiFunctionOutput | void {
        let schema: any;
        let name: string = '',
            descriptionName: string = '',
            titleName: string = '';

        if (!response.schema) return;

        if (response.schema['$ref']) {
            ({schema, name} = this.getReference(response.schema['$ref']));
        } else {
            schema = response.schema;
        }

        descriptionName = this.getNameFromDescription(response.description);
        titleName = this.getNameFromDescription(schema.title);

        schema.name = response.name || schema.name || name || titleName || descriptionName;
        return this.getOutputFromResponseSchema(schema);
    }

    methodToAbiFunction(name: string, method: string, content: OperationObject) {
        let inputs: AbiFunctionInput[] = [];
        let outputs: AbiFunctionOutput[] = [];
        let abiFunction: AbiFunction;
        let signature: SignatureData;
        let devdocParameters: DocParams = {};
        let return_responses, return_response: any, return_errors;

        name = this.getGapiNameFromOapi(name, method);

        if (content.parameters) {
            content.parameters.forEach((parameter) => {
                let input: any;
                if ((<ParameterObject>parameter).schema) {
                    input = this.getOutputFromResponse((<ParameterObject>parameter));
                } else {
                    input = {
                        name: (<ParameterObject>parameter).name,
                        type: this.getGapiType((<ParameterObject>parameter)),
                    };
                }
                input.extra = {
                    required: (<ParameterObject>parameter).required,
                    in: (<ParameterObject>parameter).in,
                };

                inputs.push(input);

                devdocParameters[(<ParameterObject>parameter).name] = (<ParameterObject>parameter).description;
            });
        }

        return_responses = Object.keys(content.responses).sort().filter((code: string) => {
            return code[0] === "2";
        });

        return_errors = Object.keys(content.responses).sort().filter((code: string) => {
            return code[0] != "2";
        });

        if (return_errors.length) {
            let output: any;
            output = this.getOutputFromResponse(content.responses[return_errors[0]]);
            if (output) {
                return_errors.shift();
                if (return_errors.length) {
                    output.extra = {
                        values: return_errors.map((code) => {
                            return {code, message: content.responses[code].description}
                        })
                    };
                }
                outputs.push(output);
            }
        }

        if (return_responses.length) {
            let output: any;

            return_response = return_responses.shift();
            output = this.getOutputFromResponse(content.responses[return_response]);
            if (output) {
                if (return_responses.length) {
                    output.extra = {
                        values: return_responses.map((code) => {
                            return {code, message: content.responses[code].description}
                        })
                    };
                }
                outputs.push(output);
            }
        }

        abiFunction = {
            name,
            type: AbiType.FUNCTION,
            inputs,
            outputs,
            constant: method === 'get' ? true : false,
            payable: false,
            stateMutability: method === 'get' ? StateMutability.VIEW : StateMutability.NONPAYABLE,
        };

        this.gapi.push(abiFunction);

        signature = this.getSignature(
            abiFunction.name,
            abiFunction.inputs.map(input => input.type),
        );

        this.natspec.methods[signature] = {
            notice: content.description,
            params: devdocParameters,
        };

        // The return description type is taken
        // from the first code of type 2xx
        if (return_response) {
            this.natspec.methods[signature].return = content.responses[return_response].description;
        }
    }
}
