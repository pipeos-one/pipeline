function enrichedGraphSteps(fullgraph) {
  const graphCopy = JSON.parse(JSON.stringify(fullgraph));
  const {rich_graph, runnable_graph, context} = graphCopy;
  let contextCopy = {};

  Object.keys(rich_graph.n).forEach(nodeIndex => {
    const node = rich_graph.n[nodeIndex];
    const contextKey = `${node.id}_${nodeIndex}`;
    contextCopy[contextKey] = JSON.parse(JSON.stringify(context[node.id]));
    rich_graph.n[nodeIndex].id = contextKey;

    contextCopy[contextKey].pfunction.gapi.inputs_idx = JSON.parse(JSON.stringify(contextCopy[contextKey].pfunction.gapi.inputs));
    contextCopy[contextKey].pfunction.gapi.outputs_idx = JSON.parse(JSON.stringify(contextCopy[contextKey].pfunction.gapi.outputs));
  });

  const levelCount = runnable_graph.length;
  const enrichedNodes = runnable_graph.map((level, levelNo) => level.map(nodeIndex => {
    // console.log('nodeIndex', nodeIndex, levelNo);
    const node = rich_graph.n[nodeIndex];
    node.record = contextCopy[node.id];
    const olen = node.record.pfunction.gapi.outputs.length;
    const ilen = node.record.pfunction.gapi.inputs.length;

    // outputs get the name of the inputs
    if (levelNo < levelCount - 1) {
      node.outputs = [...Array(olen + 1).keys()].slice(1).map(i => {
        const findex = node.out[i][0][0];
        const oindex = node.out[i][0][1] - 1;  // starts at 1
        const output = JSON.parse(JSON.stringify(contextCopy[rich_graph.n[findex].id].pfunction.gapi.inputs[oindex]));

        output.name += `_${findex}_${oindex}`;
        contextCopy[rich_graph.n[findex].id].pfunction.gapi.inputs_idx[oindex] = output;
        return output;
      });
      // console.log('node.outputs', JSON.stringify(node.outputs));
    }
    if (levelNo > 0) {
      node.inputs = [...Array(ilen + 1).keys()].slice(1).map(i => {
        // console.log('node.inputs', i, node.in[i]);
        const findex = node.in[i][0];
        const oindex = node.in[i][1] - 1;  // starts at 1
        const input = JSON.parse(JSON.stringify(contextCopy[rich_graph.n[findex].id].pfunction.gapi.outputs[oindex]));

        input.name += `_${findex}_${oindex}`;
        contextCopy[rich_graph.n[findex].id].pfunction.gapi.outputs_idx[oindex] = input;
        return input;
      });
      // console.log('-- node.inputs', JSON.stringify(node.inputs));
    }
    return node;
  }));

  return enrichedNodes;
}

export {enrichedGraphSteps};
