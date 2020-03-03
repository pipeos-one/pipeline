import {enrichedGraphSteps} from './enrichedGraphSteps';

const stateMap = {
  'pure': 0,
  'view': 1,
  'nonpayable': 2,
  'payable': 3,
}

const stateMapR = {
  0: 'pure',
  1: 'view',
  2: 'nonpayable',
  3: 'payable'
}

const sourceBuilder = (langBuilder) => (enrichedGraph) => (functionName = "function00") => {
  if (!langBuilder) throw new Error('Language not available');

  const runlen = enrichedGraph.runnable_graph.length;
  if (
    runlen === 0
    || (runlen === 1 && enrichedGraph.runnable_graph[0].length === 0)
  ) {
    return {
      source: '',
      gapi: {
        name: functionName,
        payable: false,
        stateMutability: 'pure',
        inputs: [],
        outputs: [],
      },
      arguments: []
    };
  }
  const enrichedNodes = enrichedGraphSteps(enrichedGraph);
  const inputs = enrichedNodes.shift() || [];
  let outputs = enrichedNodes.pop();
  const events = enrichedNodes
    .map(step => step.filter(node => node.record.pfunction.gapi.type === 'event'))
    .reduce((accum, n) => {
      return accum.concat(n);
    }, []);

  if (outputs[0].i < 3000) {
    enrichedNodes.push(outputs);
    outputs = [];
  }

  let stateType = 0;
  enrichedNodes.forEach(row => row.map(step => {
    const state = stateMap[step.record.pfunction.gapi.stateMutability];
    if (state > stateType) {
      stateType = state;
    }
  }));

  const fdefGapi = {
    name: functionName,
    payable: stateMapR[stateType] === 'payable',
    stateMutability: stateMapR[stateType],
    inputs: inputs.map(inp => inp.record.pfunction.gapi.outputs_idx[0]),
    outputs: outputs.map(out => out.inputs[0]),
  }
  const fdef = langBuilder.fdefinition(fdefGapi, 'public');

  // Function body - graph steps
  const body = [].concat(
    ...enrichedNodes.map(row => row.map(langBuilder.buildGraphStep))
  ).join('\n');

  let fsource;
  if (events.length > 0 && langBuilder.buildFunctionWithEvents) {
    fsource = langBuilder.buildFunctionWithEvents(fdefGapi, body, outputs.map(out => out.inputs[0]), events);
  } else {
    fsource = langBuilder.buildFunction(fdef, body, outputs.map(out => out.inputs[0]), events);
  }

  const uniqueNodes = [...new Set([].concat(
    ...enrichedNodes
  )).values()];
  const pclassMap = {};
  uniqueNodes.forEach(node => {
    if (!pclassMap[node.record.pclassid]) {
      pclassMap[node.record.pclassid] = {
        pclass: node.record.pclass,
        fimports: [],
      }
    }
    pclassMap[node.record.pclassid].fimports.push(node.record);
  });

  const imports = langBuilder.buildImports(pclassMap, functionName);
  const source = imports + langBuilder.buildContainer(pclassMap, fsource, functionName);

  return {
    source,
    gapi: Object.assign({}, fdefGapi, {
      inputs: langBuilder.setTypes(
        inputs.map(inp => inp.record.pfunction.gapi.outputs_idx[0])
      ),
      outputs: langBuilder.setTypes(outputs.map(out => out.inputs[0])),
    }),
    arguments: langBuilder.arguments(pclassMap),
  }
}

export default sourceBuilder;
