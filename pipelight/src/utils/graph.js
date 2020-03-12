import { buildinterpreterArgs } from './interpreter.js';

const CHAINLENS_API = process.env.REACT_APP_CHAINLENS_SERVER;

export async function saveGraph(chainid, pipeInterpreter, graphData, pipeoutput) {
  console.log('--saveGraph', chainid, pipeInterpreter, graphData, pipeoutput);
  const { pipegraph, graphStepsAbi, soliditySource } = pipeoutput;
  const { onchainid, graph, receipt } = await saveGraphOnChain(pipeInterpreter, pipegraph, graphStepsAbi, soliditySource.gapi);
  console.log('onchainid, receipt', onchainid, receipt);

  graphData.data.shortPgraph = pipegraph.rich_graph.init;
  graphData.data.runnablePgraph = pipegraph.runnable_graph;
  graphData.data.onchainPgraph = graph;
  graphData.data.onchainid = onchainid;
  graphData.data.chainid = chainid;
  graphData.data.interpreter = pipeInterpreter.address;

  console.log('graphData server', graphData);
  const savedGraph = await saveGraphOnServer(graphData);
  return { savedGraph, receipt };
}

export async function saveGraphOnServer(graph) {
  const api = `${CHAINLENS_API}/graph`;
  return await postData(api, graph);
}

export async function saveGraphOnChain(pipeInterpreter, pipegraph, graphStepsAbi, graphAbi) {
  console.log(pipeInterpreter, pipegraph, graphStepsAbi, graphAbi);
  const graphData = buildinterpreterArgs([pipegraph.rich_graph.init], graphStepsAbi, [graphAbi]);
  console.log('graphData', graphData);

  const graph = {
    steps: graphData.allArgs[0].steps,
    outputIndexes: graphData.allArgs[0].outputIndexes,
  }
  console.log('graphSteps', graph);

  const onchainid = (await pipeInterpreter.count()).toNumber();
  console.log('onchainid', onchainid);
  const response = await pipeInterpreter.insert(graph);
  console.log('response', response);
  const receipt = await response.wait(2);

  const count = (await pipeInterpreter.count()).toNumber();
  console.log('count', count);
  if (count <= onchainid) {
    throw new Error('Graph was not saved on chain');
  }

  return { onchainid, graph, receipt };
}

export async function postData(url = '', data = {}) {
  console.log('data', data);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}
