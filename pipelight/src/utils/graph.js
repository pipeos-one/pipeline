import { getSignatureString, getSignature } from './utils.js';
import { saveGraphOnServer, getGraphsServer, getDataServer } from './chainlens.js';

export async function saveGraph(chainid, pipeInterpreter, graphData, pipeoutput) {
  const { pipegraph, graphAbi, interpreterGraph, onlySolidity } = pipeoutput;

  if (!graphAbi || graphAbi.length === 0) {
    console.error('Cannot save empty graphs');
    return {};
  }

  graphData.data.shortPgraph = pipegraph.rich_graph.init;
  graphData.data.runnablePgraph = pipegraph.runnable_graph;
  graphData.data.gapi = JSON.parse(JSON.stringify(graphAbi));
  graphData.data.gapi.name = graphData.data.name;
  graphData.data.gapi.type = 'function';
  graphData.data.chainid = chainid;

  let receipt = {};
  if (onlySolidity) {
    if (!interpreterGraph || interpreterGraph.steps.length === 0) {
      console.error('Cannot save empty graphs');
      return {};
    }

    const { onchainid, graph, receipt: txreceipt } = await saveGraphOnChain(
      pipeInterpreter,
      {
        steps: interpreterGraph.steps,
        outputIndexes: interpreterGraph.outputIndexes
      },
    );
    console.log('onchainid, receipt', onchainid, receipt);

    graphData.data.onchainPgraph = graph;
    graphData.data.onchainid = onchainid;
    graphData.data.interpreter = pipeInterpreter.address;
    receipt = txreceipt;
  }

  console.log('graphData server', graphData);
  const savedGraph = await saveGraphOnServer(graphData);
  return { savedGraph, receipt };
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

export async function getGraphs(chainid, limit, skip = 0) {
  const graphs = await getGraphsServer(chainid, limit, skip = 0);
  return graphsToPclass(graphs);
}

export async function getGraphContext(shortPgraph) {
  const funcapi = `pfunction`;
  const graphapi = `graph`;
  let context = [];
  const pfunctionids = [];
  const graphids = [];
  const filter = {"include":[
    {
      "relation":"pclass",
      "scope":{"include":[{"relation":"pclassInstances"}]}
    }
  ]};

  Object.keys(shortPgraph.n).forEach(port => {
    if (port < 3000) {
      pfunctionids.push(shortPgraph.n[port].id);
    }
  });
  for (let _id of pfunctionids) {
    const pfunction = await getDataServer(funcapi, _id, filter);

    if (pfunction && !pfunction.error) {
      context.push(pfunction);
    } else {
      graphids.push(_id);
    }
  }

  for (let _id of graphids) {
    const graph = await getDataServer(graphapi, _id);
    if (graph) {
      const pfunction = graphToPfunction(graph);
      pfunction.pclass = graphToPclassFull(graph);
      context.push(pfunction);

      const subcontext = await getGraphContext(graph.data.shortPgraph);
      context = context.concat(subcontext);
    }
  }

  return context;
}

export function graphToPclassFull(graph) {
  const pclass = graphToPclass(graph);
  pclass.pfunctions.push(graphToPfunction(graph));
  pclass.pclassInstances.push(graphToPclassi(graph));
  return pclass;
}

export function graphsToPclass(graphs) {
  const pclasses = {};
  graphs.forEach(graph => {
    let pclass = pclasses[graph.metadata.namespace];
    if (!pclass) {
      pclass = graphToPclass(graph);
    }

    pclass.pfunctions.push(graphToPfunction(graph));
    pclass.pclassInstances.push(graphToPclassi(graph));

    pclasses[graph.metadata.namespace] = pclass;
  });
  return Object.values(pclasses);
}

export function graphToPfunction(graph) {
  let pfunction = { ...graph, pclassid: graph.metadata.namespace };
  const gapi = { ...pfunction.data.gapi };

  gapi.inputs = gapi.inputs.map(io => {
    return { name: io.name, type: io.type };
  });
  gapi.outputs = gapi.outputs.map(io => {
    return { name: io.name, type: io.type };
  });
  gapi.constant = gapi.stateMutability === 'view' || gapi.stateMutability === 'pure';
  gapi.payable = gapi.stateMutability === 'payable';
  pfunction.data.gapi = gapi;

  pfunction.data.signatureString = getSignatureString(graph.data.gapi);
  pfunction.data.signature =  getSignature(pfunction.data.signatureString);

  return pfunction;
}

export function graphToPclassi(graph) {
  let pclassi = { ...graph, type: 'graph' };
  // pclassi.data.deployment = {address: graph.data.onchainid.toString()};
  pclassi.data.deployment = graph._id;
  return pclassi;
}

export function graphToPclass(graph) {
  const pclass = {
    ...graph,
    _id: graph.metadata.namespace,
    name: graph.metadata.namespace,
    pfunctions: [],
    pclassInstances: [],
  }
  pclass.data.name = graph.metadata.namespace;
  return pclass;
}
