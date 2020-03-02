import {sourceBuilder, solidityBuilder, web3Builder} from '@pipeos/pipesource';

export function getPipegraphInfo(new_gr, activeCanvas, selectedFunctions) {
  console.log('onChange new_gr', new_gr);
  const graphSource = {...new_gr.rich_graph.init};

  // TODO: for non-Solidity graphs
  const soliditySource = sourceBuilder(solidityBuilder)(new_gr)(`function${activeCanvas}`);

  const web3jsSource = sourceBuilder(web3Builder)(new_gr)(`function${activeCanvas}`);
  const web3jsSourceFunction = (jsSource, runArguments) => `function() {
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = provider.getSigner();
  const graphArguments = [${runArguments.join(', ')}];
  const {function${activeCanvas}} = pipedGraph(...graphArguments, provider, signer, ethers);

  return function${activeCanvas}(...arguments);

  ${jsSource}
}
`
  let deploymentArgs = [];
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
                address: deployment.openapiid ? `http://${deployment.host}${deployment.basePath}` : deployment.address,
                contractName: functionObj.pclass.data.name,
            };
            deploymentArgs.push(contract_address);
        }
    });
      // selectedFunctions.forEach(pipedFunction => {
      //     let functionObj = pipedFunction.find(func => func._id === node._id);
      //     if (functionObj) {
      //         let deployment = functionObj.pclass.deployment.pclassi;
      //         let contract_address = {
      //             funcName: node.funcName,
      //             deployment: deployment.openapiid ? `http://${deployment.host}${deployment.basePath}` : deployment.address,
      //             contractName: functionObj.pclass.name,
      //         };
      //         deploymentArgs.push(contract_address);
      //     }
      // });
  });

  return { soliditySource, deploymentArgs, web3jsSource, graphSource, web3jsSourceFunction }
}
