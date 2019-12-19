import {enrichedGraphSteps} from './enrichedNodes';

const sourceBuilder = (langBuilder) => (enrichedGraph) => (functionName = "function00") => {
  if (!langBuilder) throw new Error('Language not available');
  if (enrichedGraph.runnable_graph.length === 0) {
    return {source: '', inputs: [], outputs: []};
  }
  const enrichedNodes = enrichedGraphSteps(enrichedGraph);
  const inputs = enrichedNodes.shift();
  let outputs = enrichedNodes.pop();

  if (outputs[0].i < 3000) {
    enrichedNodes.push(outputs);
    outputs = [];
  }

  // Function definition
  // fixme TODO: payable only if payable
  const fdef = langBuilder.fdefinition({
    name: functionName,
    payable: true,
    stateMutability: 'payable',
    inputs: inputs.map(inp => inp.record.pfunction.gapi.outputs_idx[0]),
    outputs: outputs.map(out => out.inputs[0]),
  }, 'public');

  // Function body - graph steps
  const body = [].concat(
    ...enrichedNodes.map(row => row.map(langBuilder.buildGraphStep))
  ).join('\n');

  const fsource = langBuilder.buildFunction(fdef, body, outputs.map(out => out.inputs[0]));

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
    inputs: langBuilder.setTypes(
      inputs.map(inp => inp.record.pfunction.gapi.outputs_idx[0])
    ),
    outputs: langBuilder.setTypes(outputs.map(out => out.inputs[0])),
    arguments: langBuilder.arguments(pclassMap),
  }
}

export default sourceBuilder;
