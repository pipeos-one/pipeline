import introspect from './introspect.js';

export default function libraryToAbi(instance) {
    const entries = Object.entries(instance);
    let abi = [];
    entries.forEach((entry) => {
        introspectFunction(abi, ...entry);
    });
    return abi;
}

function introspectFunction(abi, functionName, instance) {
    try {
        abi.push({
            name: functionName,
            type: 'function',
            inputs: introspect(instance).map((input) => {
                return {name: input, type: ''}
            }),
            outputs: [],
        })
    } catch(error) {
        console.log(error);
    }
}
