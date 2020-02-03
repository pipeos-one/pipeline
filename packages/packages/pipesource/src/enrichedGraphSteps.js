function enrichedGraphSteps(fullgraph) {
  const graphCopy = JSON.parse(JSON.stringify(fullgraph));
  const {rich_graph, runnable_graph, context} = graphCopy;
  let contextCopy = {};

  Object.keys(rich_graph.n).forEach(nodeIndex => {
    const node = rich_graph.n[nodeIndex];
    const contextKey = `${node.id}_${nodeIndex}`;
    contextCopy[contextKey] = JSON.parse(JSON.stringify(context[node.id]));
    rich_graph.n[nodeIndex].id = contextKey;

    const gapi = contextCopy[contextKey].pfunction.gapi;
    gapi.inputs_idx = JSON.parse(JSON.stringify(gapi.inputs));
    gapi.outputs_idx = JSON.parse(JSON.stringify(gapi.outputs));
  });

  const levelCount = runnable_graph.length;
  const enrichedNodes = runnable_graph.map((level, levelNo) => {
    if (!level) return null;

    return level.map(nodeIndex => {
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

          // We just need the name
          const output = {
            ...node.record.pfunction.gapi.outputs[i - 1],
            name: contextCopy[rich_graph.n[findex].id].pfunction.gapi.inputs[oindex].name,
          }

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

          // We just need the name
          const input = {
            ...node.record.pfunction.gapi.inputs[i - 1], // starts at 0
            name: contextCopy[rich_graph.n[findex].id].pfunction.gapi.outputs[oindex].name,
          }

          input.name += `_${findex}_${oindex}`;
          contextCopy[rich_graph.n[findex].id].pfunction.gapi.outputs_idx[oindex] = input;
          return input;
        });
        // console.log('-- node.inputs', JSON.stringify(node.inputs));
      }
      return node;
    })
  });

  return enrichedNodes;
}

export {enrichedGraphSteps};
