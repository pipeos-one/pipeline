import { gapiStripTemporary, gapiStripPayable, getSignatureString, getSignature } from './utils.js';
import { getGraphContext } from './graph.js';

export async function getPipegraphInfo(newGraph, activeCanvas, selectedFunctions, pipegraph, graphResolvers) {
  // console.log('onChange new_gr', newGraph);
  const new_gr = JSON.parse(JSON.stringify(newGraph));
  const graphSource = {...new_gr.rich_graph.init};

  let soliditySource = await pipegraph.pipe.build_and_run_graph(new_gr.context)(graphSource)(graphResolvers.sourcesol)([]);

  let web3jsSource = await pipegraph.pipe.build_and_run_graph(new_gr.context)(graphSource)(graphResolvers.sourcejs)([]);
  web3jsSource = `
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = provider.getSigner();
  ${web3jsSource}
  `;

  const execute = pipegraph.pipe.build_and_run_graph(new_gr.context)(graphSource)(graphResolvers.runtime);

  const graphAbi = graphResolvers.sourcesol.getGapi();

  let deploymentArgs = [];
  let graphStepsAbi = {};
  let funcContexts = {};
  let onlySolidity = true;
  Object.values(new_gr.rich_graph.init.n).map(node => {
    return {
      _id: node.id,
      funcName: new_gr.context[node.id].pfunction.gapi.name,
    }
  }).forEach(node => {
    selectedFunctions.forEach(canvasFuncs => {
        let functionObj = canvasFuncs[node._id];
        if (functionObj) {
            // TODO fixme deployment per chain
            let deployment = functionObj.pclass.pclassInstances[0].data.deployment;

            let contract_address = {
                funcName: node.funcName,
                address: (deployment.openapiid ? `http://${deployment.host}${deployment.basePath}` : deployment.address) || deployment,
                contractName: functionObj.pclass.data.name,
            };
            deploymentArgs.push(contract_address);

            const abii = gapiStripTemporary(gapiStripPayable(functionObj.data.gapi))
            const signatureFull = getSignatureString(abii);
            const signature = getSignature(signatureFull);

            let addressOrGraphId = functionObj.data.onchainid || contract_address.address;

            if (!addressOrGraphId) addressOrGraphId = deployment;

            graphStepsAbi[functionObj._id] = {
                name: node.funcName,
                abi: functionObj.data.gapi,
                signature,
                deployment: addressOrGraphId,
                contractName: functionObj.pclass.data.name,
            }
            funcContexts[node._id] = new_gr.context[node._id];
            if (functionObj.metadata.categories[0] !== 'solidity') {
              onlySolidity = false;
            }
        }
    });
  });

  if (!onlySolidity) {
    soliditySource = '';
  }

  return { soliditySource, web3jsSource, graphSource, graphAbi, graphStepsAbi, deploymentArgs, execute, onlySolidity };
}
