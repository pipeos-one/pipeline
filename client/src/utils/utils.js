export function randomId() {
    return Math.floor(Math.random() * (10 ** 10));
}

export function pfunctionColorClass(gapi) {
    let colorClass = '';
    if (gapi.type === 'event') {
        colorClass = 'event';
    } else if (gapi.payable) {
        colorClass = 'payable';
    } else if (!gapi.constant) {
        colorClass = 'nonconstant';
    }
    return colorClass;
}

export function linkReferencesSolcToEthPM(linkReferences = {}) {
    const lreferences = [];

    Object.keys(linkReferences).forEach((fileName) => {
        Object.entries(linkReferences[fileName]).forEach((entry) => {
            const libName = entry[0];
            const links = entry[1];
            const offsets = links.map(link => link.start);
            lreferences.push({
                offsets,
                length: links[0].length,
                name: libName,
            });
        });
    });
    return lreferences;
}

export const JsonArrayToString = function (json) {
    let functionArgs = JSON.stringify(json);
    functionArgs = functionArgs.substring(
        1,
        functionArgs.length - 1,
    ).replace(/\\"/g, '"');
    return functionArgs;
};

const EMPTY_NATSPEC = {methods: {}};

export const getNatspec = (devdoc = EMPTY_NATSPEC, userdoc = EMPTY_NATSPEC) => {
    const natspec = Object.assign({}, userdoc, devdoc);
    Object.keys(userdoc.methods).forEach((methodName) => {
        natspec.methods[methodName] = Object.assign(
            userdoc.methods[methodName],
            natspec.methods[methodName],
        );
    });
    return natspec;
};

export function compiledContractProcess(compiled) {
    const sources = [];
    let compiledContracts = [];

    Object.keys(compiled.source.sources).forEach((key) => {
        if (key === 'target') return;
        sources.push({
            relative_path: key,
            source: compiled.source.sources[key].content,
        });
    });
    Object.entries(compiled.data.contracts).forEach((entryArray) => {
        const contractsAtPath = entryArray[1];
        Object.entries(contractsAtPath).forEach((entry) => {
            const contractName = entry[0];
            const compiledContract = entry[1];
            let metadataJson;

            if (compiledContract.metadata) {
                try {
                    metadataJson = JSON.parse(compiledContract.metadata);
                    metadataJson.settings.compilationTarget = {
                        filePath: Object.keys(metadataJson.settings.compilationTarget)[0],
                        contractName: Object.values(metadataJson.settings.compilationTarget)[0],
                    };
                } catch (err) {
                    console.log(
                        `Error found when extracting metadata for ${contractName}, metadata: ${compiledContract.metadata}`,
                        err,
                    );
                }
            }

            const data = {
                name: contractName,
                type: 'sol',
                pclass: {
                    gapi: compiledContract.abi,
                    natspec: getNatspec(compiledContract.devdoc, compiledContract.userdoc),
                    // linked bytecode
                    // deployment_bytecode: ,
                    // unlinked bytecode
                    runtime_bytecode: {
                        bytecode: `0x${compiledContract.evm.bytecode.object}`,
                        link_references: linkReferencesSolcToEthPM(
                            compiledContract.evm.bytecode.linkReferences,
                        ),
                        // link_dependencies: [],
                    },
                    metadata: compiledContract.metadata,
                    compiler: {
                        name: 'solc',
                        version: metadataJson ? metadataJson.compiler.version : undefined,
                        settings: metadataJson ? metadataJson.settings : undefined,
                    },
                    sources,
                    // TODO:
                    // flatsource: ,
                    // flatsource_hash: ,
                },
                tags: [],
            };

            // Remove duplicate abi, devdoc, userdoc
            delete data.pclass.metadata.output;
            console.log('data', data);
            compiledContracts.push(data);
        });
    });
    return compiledContracts;
}
