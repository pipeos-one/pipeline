import { ethers } from 'ethers';
import { getSignatureString } from './utils.js';

const CHAINLENS_API = process.env.REACT_APP_CHAINLENS_SERVER;

export async function saveGraph(chainid, pipeInterpreter, graphData, pipeoutput) {
  const { pipegraph, soliditySource, interpreterGraph } = pipeoutput;

  const { onchainid, graph, receipt } = await saveGraphOnChain(
    pipeInterpreter,
    {
      steps: interpreterGraph.steps,
      outputIndexes: interpreterGraph.outputIndexes
    },
  );
  console.log('onchainid, receipt', onchainid, receipt);

  graphData.data.shortPgraph = pipegraph.rich_graph.init;
  graphData.data.runnablePgraph = pipegraph.runnable_graph;
  graphData.data.onchainPgraph = graph;
  graphData.data.gapi = JSON.parse(JSON.stringify(soliditySource.gapi));
  graphData.data.gapi.name = graphData.data.name;
  graphData.data.gapi.type = 'function';
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

export async function saveGraphOnChain(pipeInterpreter, graph) {
  const onchainid = (await pipeInterpreter.count()).toNumber();
  console.log('onchainid', onchainid);
  const response = await pipeInterpreter.insert(graph);
  console.log('response', response);
  const receipt = await response.wait(2);
  const count = (await pipeInterpreter.count()).toNumber();

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

export async function getGraphs(chainid, limit, skip = 0) {
  let filter = {where: {}};
  if (limit) {
    filter.limit = limit;
  }
  if (skip) {
    filter.skip = skip;
  }
  if (chainid) {
    filter.where['data.chainid'] = chainid;
  }
  const url = `${CHAINLENS_API}/graph?filter=${JSON.stringify(filter)}`;

  const response = await fetch(url);
  const graphs = await response.json();
  return graphsToPclass(graphs);
}

export async function getGraphContext(shortPgraph) {
  const api = `${CHAINLENS_API}/pfunction`;
  const context = [];
  const pfunctionids = [];
  const filter = '{"include":[{"relation":"pclass","scope":{"include":[{"relation":"pclassInstances"}]}}]}';

  Object.keys(shortPgraph.n).forEach(port => {
    if (port < 3000) {
      pfunctionids.push(shortPgraph.n[port].id);
    }
  });
  for (let _id of pfunctionids) {
    const response = await fetch(`${api}/${_id}?filter=${filter}`);
    const pfunction = await response.json();

    context.push(pfunction);
  }
  return context;
}

export function graphsToPclass(graphs) {
  console.log('graphs', graphs);
  const pclasses = {};
  graphs.forEach(graph => {
    if (!pclasses[graph.metadata.namespace]) {
      pclasses[graph.metadata.namespace] = {
        ...graph,
        _id: graph.metadata.namespace,
        name: graph.metadata.namespace,
        pfunctions: [],
        pclassInstances: [],
      }
    }
    let pfunction = { ...graph, pclassid: graph.metadata.namespace };
    pfunction.data.signatureString = getSignatureString(graph.data.gapi);
    const abii = new ethers.utils.Interface([graph.data.gapi]);
    pfunction.data.signature = abii.functions[graph.data.gapi.name].sighash;
    pclasses[graph.metadata.namespace].pfunctions.push(pfunction);

    let pclassi = {
      ...graph,
      type: 'graph',
    };
    pclassi.data.deployment = {address: graph.data.onchainid.toString()};
    pclasses[graph.metadata.namespace].pclassInstances.push(pclassi);
  });
  console.log('pclasses', pclasses);
  return Object.values(pclasses);
}
