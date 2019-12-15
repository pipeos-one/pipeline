import {enrichedGraphSteps} from './enrichedNodes';

const sourceBuilder = (langBuilder) => (enrichedGraph) => {
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
  const fname = 'func0';
  const ins = langBuilder.finputs(inputs.map(inp => inp.record.pfunction.gapi.outputs_idx[0]));
  const outs = langBuilder.foutputs(outputs.map(out => out.inputs[0]));
  const fdef = langBuilder.fdefinition(fname, ins, outs);

  // Function body - graph steps
  const body = [].concat(
    ...enrichedNodes.map(row => row.map(langBuilder.buildGraphStep))
  ).join('\n');
  const freturn = langBuilder.buildFout(outputs);
  const fsource = fdef + '\n' + body + '\n' + freturn;

  let imports = [...new Set([].concat(
    ...enrichedNodes.map(row => row.map(langBuilder.buildImports))
  )).values()].join('\n');

  if (langBuilder.buildExtra) {
    const extra = langBuilder.buildExtra([...new Set([].concat(
      ...enrichedNodes
    )).values()]);
    imports += extra;
  }

  const source = langBuilder.buildContainer(imports, fsource);

  return {
    source,
    inputs: langBuilder.setTypes(
      inputs.map(inp => inp.record.pfunction.gapi.outputs_idx[0])
    ),
    outputs: langBuilder.setTypes(outputs.map(out => out.inputs[0])),
  }
}

export default sourceBuilder;
