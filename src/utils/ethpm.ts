import {EthPMPackageJson} from '../interfaces/ethpm';

export let pipeToEthpm = (ppackage: any, pclasses: any, pclassii: any): EthPMPackageJson => {
    let contract_types: any = {}, deployments: any = {}, sources: any = {};
    let classidToAlias: any = {};

    pclasses.forEach((pclass: any) => {
        let contract_alias = pclass.name;
        classidToAlias[pclass._id] = contract_alias;

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
        let bip122_uri = pclassi.instance.bip122_uri;

        if (!deployments[bip122_uri]) {
            deployments[bip122_uri] = {}
        }
        deployments[bip122_uri][pclassi.instance.instance_name] = {
            contract_type: classidToAlias[pclassi.classid],
            address: pclassi.instance.address,
            transaction: pclassi.instance.transaction,
            block: pclassi.instance.block,
            runtime_bytecode: pclassi.instance.runtime_bytecode,
            compiler: pclassi.instance.compiler,
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
