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

  if (enriched.pfunction.gapi.type === 'event') {
    enriched.pfunction.gapi.outputs = JSON.parse(JSON.stringify(enriched.pfunction.gapi.inputs));
    enriched.pfunction.gapi.inputs = [];
    return enriched;
  }

  if (enriched.pfunction.gapi.payable) {
    enriched.pfunction.gapi.inputs.push({...PAYABLE_INPUT});
  }
  if (enriched.pfunction.gapi.outputs && enriched.pfunction.gapi.outputs.length === 0) {
    enriched.pfunction.gapi.outputs.push({...DEFAULT_OUTPUT});
  }
  return enriched;
}

const fdefinition = (gapi, visibility = 'public') => {
  const ins = finputs(gapi.inputs);
  const outs = foutputs(foutputsP(gapi.outputs));
  const type = gapi.stateMutability !== 'non-payable' ? gapi.stateMutability : '';

  const returnSource = outs.length === 0 ? '' : `returns (${outs.join(', ')})`;
  return `function ${gapi.name}(${ins.join(', ')})
    ${visibility} ${type}
    ${returnSource}`;
}

const buildImports = (pclassMap) => {
  const interfaces = Object.keys(pclassMap).map(pclassid => {
    const {pclass, fimports} = pclassMap[pclassid];
    const fdefs = fimports.map(node => {
      const gapi = JSON.parse(JSON.stringify(node.pfunction.gapi));
      gapi.inputs = finputsP(gapi.inputs).inputs;
      return fdefinition(gapi, 'external') + ';';
    });

    return `interface ${pclass.name}Interface {
  ${fdefs.join('\n  ')}
}`;
  });

  return `pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

${interfaces.join('\n')}
`
}

// TODO fixme
const buildContainer = (pclassMap, fsource) => {
  const interfaceDefs = [];
  const contructorArgs = [];
  const constructorAssignment = [];

  Object.keys(pclassMap).forEach(pclassid => {
    const {pclass} = pclassMap[pclassid];
    const idef = `${pclass.name}Interface public ${pclass.name};`
    const carg = `address _${pclass.name}_address`;
    const casign = `${pclass.name} = ${pclass.name}Interface(_${pclass.name}_address);`;

    interfaceDefs.push(idef);
    contructorArgs.push(carg);
    constructorAssignment.push(casign);
  });

  return `

contract PipedContract {
  ${interfaceDefs.join('\n  ')}

  constructor(${contructorArgs.join(', ')}) public {
    ${constructorAssignment.join('\n    ')}
  }

  ${fsource}
}`
}

const setTypes = ios => ios;

const finputsP = inputs => {
  const inputscpy = [...inputs];
  const weiValueIx = inputscpy.findIndex(inp => inp.payable);
  if (weiValueIx === -1) return {inputs: inputscpy, weiValue: null};

  const weiValue = inputscpy.splice(weiValueIx, 1)[0];
  return {inputs: inputscpy, weiValue};
}

const foutputsP = outputs => {
  const outputscpy = [...outputs];
  return outputscpy.filter(out => !out.temporary);
}
const finputs = inputs => setTypes(inputs).map(inp => `${inp.type} ${inp.name}`);
const foutputs = outputs => setTypes(outputs).map(out => out.type);

const buildGraphStep = (node) => {
  const {record} = node;
  const {gapi} = record.pfunction;
  const {inputs, weiValue} = finputsP(node.inputs);
  const ins = inputs.map(inp => inp.name);
  const outs = foutputsP(gapi.outputs_idx);
  let extraOptions = '';

  // contract.function.value(10).gas(800)();
  if (weiValue && gapi.payable) {
    extraOptions = `.value(${weiValue.name})`;
  }

  const fcall = `${record.pclass.name}.${gapi.name}${extraOptions}(${ins.join(', ')});`;

  if (outs.length === 1) {
    return `    ${outs[0].type} ${outs[0].name} = ${fcall}`;
  }

  const returnSource = outs.length === 0 ? '' : `(${outs.map(out => `${out.type} ${out.name}`).join(', ')}) = `;

  return `    ${returnSource}${fcall}`;
}

const buildFunction = (fdef, body, outputs) => {
  const freturn = buildFout(foutputsP(outputs));

  return `${fdef}
  {
${body}
    ${freturn}
  }
`
}

const buildFout = outputs => {
  const outs = outputs.map(out => out.name);

  return outs.length === 0 ? '' : `return ${outs.length === 1 ? outs[0] : `(${outs.join(', ')})`};`;
}

const getDeploymentArgs = () => [];

export default {
  enrichAbi,
  buildImports,
  buildContainer,
  buildFunction,
  fdefinition,
  finputs,
  foutputs,
  buildGraphStep,
  buildFout,
  setTypes,
  arguments: getDeploymentArgs,
}
