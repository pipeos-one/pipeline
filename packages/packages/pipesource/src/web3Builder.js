const PAYABLE_INPUT = {
  name: 'WEI_VALUE',
  type: 'uint256',
  payable: true,
}
const DEFAULT_OUTPUT = {
  name: 'done',
  type: 'bool',
  temporary: true,
}

const enrichAbi = (pfunc) => {
  const enriched = {...pfunc};
  const haspayable = enriched.pfunction.gapi.inputs.find(inp => inp.name === PAYABLE_INPUT.name);
  if (haspayable) return enriched;

  if (enriched.pfunction.gapi.payable) {
    enriched.pfunction.gapi.inputs.push({...PAYABLE_INPUT});
  }
  if (enriched.pfunction.gapi.outputs.length === 0) {
    enriched.pfunction.gapi.outputs.push({...DEFAULT_OUTPUT});
  }
  return enriched;
}

const fdefinition = (gapi) => {
  const ins = gapi.inputs.map(inp => inp.name);
  return `function ${gapi.name}(${ins.join(', ')})`;
}

const buildImports = (pclassMap, functionName) => {
  const addrArgs = Object.keys(pclassMap).map(pclassid => {
    const {pclass} = pclassMap[pclassid];
    return `"${pclass.deployment}"`;
  });

  return ``;
}

const deploymentArgs = (pclassMap) => {
  return Object.keys(pclassMap).map(pclassid => {
    const {pclass} = pclassMap[pclassid];
    return pclass.deployment;
  });
}

const buildContainer = (pclassMap, fsource, functionName) => {
  const addrArgs = [];
  const abidefs = Object.keys(pclassMap).map(pclassid => {
    const {pclass, fimports} = pclassMap[pclassid];
    const fgapis = fimports.map(node => {
      const gapi = JSON.parse(JSON.stringify(node.pfunction.gapi));
      gapi.inputs = finputsP(gapi.inputs).inputs;
      gapi.outputs = foutputsP(gapi.outputs);
      delete gapi.outputs_idx;
      delete gapi.inputs_idx;
      return gapi;
    });
    addrArgs.push(`address_${pclass.name}`);

    return `
  const abi_${pclass.name} = ${JSON.stringify(fgapis)};
  const ${pclass.name} = new ethers.Contract(address_${pclass.name}, abi_${pclass.name}, signer);`;
  });

  return `function pipedGraph(${addrArgs.join(', ')}, signer) {

  ${abidefs.join('\n')}

  ${fsource}

  return {${functionName}};
}`
}

const setTypes = ios => ios;

const finputsP = inputs => {
  const inputscpy = JSON.parse(JSON.stringify(inputs));
  const weiValueIx = inputscpy.findIndex(inp => inp.payable);
  if (weiValueIx === -1) return {inputs: inputscpy, weiValue: null};

  const weiValue = inputscpy.splice(weiValueIx, 1)[0];
  return {inputs: inputscpy, weiValue};
}

const foutputsP = outputs => {
  const outputscpy = JSON.parse(JSON.stringify(outputs));
  return outputscpy.filter(out => !out.temporary);
}

const buildGraphStep = (node, stepIndex) => {
  const {record} = node;
  const {gapi} = record.pfunction;
  const {inputs, weiValue} = finputsP(node.inputs);
  const ins = inputs.map(inp => inp.name);
  const outs = gapi.outputs_idx.map(out => out.name);

  let extraOptions = '';

  if (weiValue && gapi.payable) {
    extraOptions = `, {value: ${weiValue.name}}`
  }

  const fcall = `await ${record.pclass.name}.${gapi.name}(${ins.join(', ')}${extraOptions});`;

  let returnSource;

  if (outs.length === 1) {
    returnSource = `const ${outs[0]} = `;
  } else {
    // TODO fixme
    returnSource = `const [${outs.join(', ')}] = `;
  }

  return `    ${returnSource}${fcall}
`;
}

const buildFunction = (fdef, body, outputs) => {
  const freturn = buildFout(outputs);

  return `async ${fdef}
  {
${body}
    ${freturn}
  }
`
}

const buildFout = outputs => {
  const outs = outputs.map(out => out.name);

  return `return {${outs.join(', ')}};`
}

export default {
  enrichAbi,
  buildImports,
  buildContainer,
  buildFunction,
  fdefinition,
  buildGraphStep,
  buildFout,
  setTypes,
  arguments: deploymentArgs,
}
