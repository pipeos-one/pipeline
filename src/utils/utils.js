export function randomId() {
    return Math.floor(Math.random() * (10 ** 10));
}

export function pipeFunctionColorClass(abiObj) {
    let colorClass = '';
    if (abiObj.type === 'event') {
        colorClass = 'event';
    } else if (abiObj.type === 'payable') {
        colorClass = 'payable';
    } else if (!abiObj.constant) {
        colorClass = 'nonconstant';
    }
    return colorClass;
}

export function compiledContractProcess(compiled, callback) {
    // let additional_solsources;
    // if (Object.keys(compiled.source.sources).length > 1) {
    //     additional_solsources = Object.assign({}, compiled.source.sources);
    //     delete additional_solsources[target];
    // }
    Object.entries(compiled.data.contracts).forEach((entryArray) => {
        const target = entryArray[0];
        const targetObj = entryArray[1];
        Object.entries(targetObj).forEach((entry) => {
            console.log(entry);
            const name = entry[0];
            const contract = entry[1];
            const data = {
                name,
                container: {
                    abi: contract.abi,
                    devdoc: contract.devdoc,
                    userdoc: contract.userdoc,
                    solsource: compiled.source.sources[target].content,
                    // additional_solsources,
                    bytecode: contract.evm.bytecode,
                    deployedBytecode: contract.evm.deployedBytecode,
                    metadata: contract.metadata,
                },
                tags: [],
            };

            // Remove duplicate abi, devdoc, userdoc
            delete data.container.metadata.output;
            console.log('data', data);
            callback(data);
        });
    });
}
