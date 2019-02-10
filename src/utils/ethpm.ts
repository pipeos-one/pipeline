import {EthPMPackageJson} from '../interfaces/ethpm';

export let pipeToEthpm = (ppackage: any, pclasses: any, pclassii: any): EthPMPackageJson => {
    let contract_types: any = {}, deployments: any = {}, sources: any = {};
    let pclassidToAlias: any = {};

    pclasses.forEach((pclass: any) => {
        let contract_alias = pclass.name;
        pclassidToAlias[pclass._id] = contract_alias;

        pclass.pclass.sources.forEach((source: any) => {
            if (!sources[source.relative_path]) {
                sources[source.relative_path] = source.storage ?
                    `${source.storage.type}://${source.storage.hash}` :
                    source.source;
            }
        });

        contract_types[contract_alias] = {
            contract_name: contract_alias != pclass.pclass.name ? pclass.pclass.name : undefined,
            deployment_bytecode: pclass.pclass.deployment_bytecode,
            runtime_bytecode: pclass.pclass.runtime_bytecode,
            abi: pclass.pclass.gapi,
            natspec: pclass.pclass.natspec,
            compiler: pclass.pclass.compiler,
        }
    });

    pclassii.forEach((pclassi: any) => {
        let bip122_uri = pclassi.pclassi.bip122_uri;

        if (!deployments[bip122_uri]) {
            deployments[bip122_uri] = {}
        }
        deployments[bip122_uri][pclassi.pclassi.instance_name] = {
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
