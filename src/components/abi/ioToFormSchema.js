import VueFormGenerator from "vue-form-generator";

let typeMap = {
    uint: {
        type: 'input',
        inputType: 'number',
        validator: VueFormGenerator.validators.integer,
        min: 0,
        max: 2 ** 256,
        placeholder: 'uint256',
    },
    int: {
        type: 'input',
        inputType: 'number',
        validator: VueFormGenerator.validators.integer,
        min: -(2 ** 256),
        max: 2 ** 256,
        placeholder: 'int256',
    },
    bool: {
        type: 'select',
        values: [true, false],
    },
    address: {
        type: 'input',
        inputType: 'text',
        validator: VueFormGenerator.validators.string,
        placeholder: 'address',
    },
    string: {
        type: 'input',
        inputType: 'text',
        validator: VueFormGenerator.validators.string,
        min: 20,
        max: 22,
        placeholder: 'string',
    },
    bytes: {
        type: 'input',
        inputType: 'text',
        validator: VueFormGenerator.validators.string,
        placeholder: 'bytes',
    },
};

for (let i = 8; i <= 256; i += 8) {
    typeMap[`uint${i}`] = Object.assign({}, typeMap.uint);
    typeMap[`uint${i}`].placeholder = `uint${i}`;
    typeMap[`int${i}`] = Object.assign({}, typeMap.int);
    typeMap[`int${i}`].placeholder = `int${i}`;
}

console.log('typeMap', typeMap);

function ioToFormSchema(io) {
    const schema = {
        type: typeMap[io.type].type,
        inputType: typeMap[io.type].inputType,
        values: typeMap[io.type].values,
        label: io.name,
        model: io.name,
        required: true,
    };
    return schema;
}

export default ioToFormSchema;
