export function randomId() {
    return Math.floor(Math.random() * (10 ** 10));
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

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


export const clipboardCopy = (text) => {
    const aux = document.createElement("input");
    aux.setAttribute("value", text);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
};


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
};

export const colorMap = {
    event: '#C9DEBB',
    payable: '#CDE0F2',
    nonconstant: '#E9DEDE',
};

export function pfunctionColor(gapi) {
    const colorClass = pfunctionColorClass(gapi);
    return colorMap[colorClass];
};
