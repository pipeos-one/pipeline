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
    SourceByFunctionName,
} from '../interfaces';
import {
    DocParams,
    Natspec,
} from '../interfaces/natspec';
import {SolType} from '../interfaces/soltypes';

export const OPENAPI_ERROR_DEFAULT: AbiFunctionOutput = {
    name: 'Error',
    type: 'tuple',
    components: [
        {name: 'code', type: 'int32'},
        {name: 'message', type: 'string'},
    ]
};

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
    sourceByFunctionName: SourceByFunctionName;
    constructor(openapiSchema: OpenApiSpec) {
        this.openapi = openapiSchema;
        this.gapi = [];
        this.natspec = {methods: {}};
        this.sourceByFunctionName = {};

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
        // Transform "/stage/position/sm/{id}/{id2}"
        // into "stagePositionSm_id_id2"
        name = name.substring(1).replace(/\/{/g, '_').replace(/}/g, '');
        let index = name.indexOf('/');
        while (index >= 0) {
            name = name.substring(0, index) + name.charAt(index + 1).toUpperCase() + name.substring(index + 2);
            index = name.indexOf('/');
        }
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
            // If the format is properties: {'$ref': }
            if (properties[prop] === '$ref') {
                props = props.concat(
                    this.getComponentsFromAllSchemaProperties(properties[prop])
                );
            } else {
                props.push(this.getOutputFromResponseSchema(properties[prop], prop));
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

    getOutputFromResponseSchema(schema: any, name: string = ''): AbiFunctionOutput {
        let type: any, components: AbiFunctionIO[] | undefined;

        if (schema['$ref']) {
            return this.getOutputFromResponseSchema(
                this.getReference(schema['$ref']).schema,
                name,
            );
        }

        if (schema.type === 'array') {
            type = 'tuple[]';
            components = this.getComponentsFromAllSchemaProperties(schema.items);
        } else if (schema.type === 'object') {
            type = 'tuple';
            components = this.getComponentsFromAllSchemaProperties(schema);
        } else {
            type = this.getGapiType(schema);
        }
        return {
            name: name || schema.name,
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

    gapiToSource(
        name: string,
        method: string,
        path: string,
        abiInputs: AbiFunctionInput[],
        abiOutputs: AbiFunctionOutput[],
    ) {
        let queries: string[] = [], body: string = '', inputs: string[] = [];

        const errorName = abiOutputs[0].name;
        const resultName = abiOutputs[1] ? abiOutputs[1].name : undefined;

        abiInputs.forEach((input: AbiFunctionInput, index: number) => {
            if (!input.extra) return;
            inputs.push(input.name);
            if (input.extra.in === 'body') {
                body = input.name;
            } else if (input.extra.in === 'query') {
                queries.push(input.name);
            }
        });

        return `async function(${inputs.join(', ')}) {
    const url = \`\${baseUrl}${path.replace('/{', '/${')}${queries.length ? `?${queries.map(query => `${query}=\${${query}}`).join('&')}` : ''}\`;
    let ${errorName};
    ${resultName ? `const ${resultName} = ` : ''}(await httpClient.${method}(url${body ? `, ${body}` : ''})
        .catch((err) => ${errorName} = err))
        .data
    return {${errorName}${resultName ? `, ${resultName}` : ''}};
}
    `;
    }

    methodToAbiFunction(path: string, method: string, content: OperationObject) {
        let inputs: AbiFunctionInput[] = [];
        let outputs: AbiFunctionOutput[] = [];
        let abiFunction: AbiFunction;
        let signature: SignatureData;
        let devdocParameters: DocParams = {};
        let return_responses, return_response: any, return_errors;
        let name;

        name = this.getGapiNameFromOapi(path, method);

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
            if (!output) {
                output = Object.assign({}, OPENAPI_ERROR_DEFAULT);
            }
            output.extra = {
                values: return_errors.map((code) => {
                    return {code, message: content.responses[code].description || ''}
                })
            };
            return_errors.shift();
            outputs.push(output);

        } else {
            outputs.push(OPENAPI_ERROR_DEFAULT);
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
            notice: content.description || content.summary,
            params: devdocParameters,
        };

        // The return description type is taken
        // from the first code of type 2xx
        if (return_response) {
            this.natspec.methods[signature].return = content.responses[return_response].description;
        }

        // create js source
        this.sourceByFunctionName[name] = this.gapiToSource(name, method, path, inputs, outputs);
    }
}
