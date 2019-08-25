import {EthPMPackageJson} from '../interfaces/ethpm';
import {chainIdToBip122Uri} from './chain';
import {dsProtocol} from './dstorage';

export let pipeToEthpm = async (
    ppackage: any,
    pclasses: any,
    pclassii: any,
    uploadCallback: any,
): Promise<EthPMPackageJson> => {
    let contract_types: any = {}, deployments: any = {}, sources: any = {};
    let pclassidToAlias: any = {};

    for (let i: number = 0; i < pclasses.length; i++) {
        let pclass = pclasses[i];
        let contract_alias = pclass.name;
        pclassidToAlias[pclass._id] = contract_alias;

        for (let j: number = 0; j < pclass.pclass.sources.length; j++) {
            let source = pclass.pclass.sources[j];
            if (!sources[source.relative_path]) {
                if (!source.storage) {
                    // We upload the source to swarm
                    let hash = await uploadCallback('swarm', source.source, 'Text');
                    if (hash) {
                        source.storage = {
                            type: 'swarm',
                            hash,
                        }
                    }
                }
                sources[source.relative_path] = source.storage
                    ? `${dsProtocol(source.storage.type)}${source.storage.hash}`
                    : source.source;
            }
        };

        contract_types[contract_alias] = {
            contract_name: contract_alias != pclass.pclass.name ? pclass.pclass.name : undefined,
            deployment_bytecode: pclass.pclass.deployment_bytecode,
            runtime_bytecode: pclass.pclass.runtime_bytecode,
            abi: pclass.pclass.gapi,
            natspec: pclass.pclass.natspec,
            compiler: pclass.pclass.compiler,
        }
    };

    pclassii.forEach((pclassi: any) => {
        let bip122_uri = pclassi.pclassi.bip122_uri || chainIdToBip122Uri(pclassi.pclassi.chainid, pclassi.pclassi.block);

        if (!deployments[bip122_uri]) {
            deployments[bip122_uri] = {}
        }
        deployments[bip122_uri][
            pclassi.pclassi.instance_name || pclassidToAlias[pclassi.pclassid]
        ] = {
            contract_type: pclassidToAlias[pclassi.pclassid],
            address: pclassi.pclassi.address,
            transaction: pclassi.pclassi.transaction,
            block: pclassi.pclassi.block,
            runtime_bytecode: pclassi.pclassi.runtime_bytecode,
            compiler: pclassi.pclassi.compiler,
        }
    });

    return {
        manifest_version: ppackage.manifest_version,
        package_name: ppackage.package_name,
        version: ppackage.version,
        meta: ppackage.meta,
        sources,
        contract_types,
        deployments,
        // build_dependencies:
    }
}

export let ethpmToPipe = (package_json: EthPMPackageJson) => {

}
