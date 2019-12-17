const typeMap = {
  'number': 'i32',
  'number[]': 'Vec<i32>',
  'string': 'String',
  'function': 'Fn(i32) -> i32',
}

const PAYABLE_INPUT = {
  name: 'WEI_VALUE',
  type: 'uint256',
  payable: true,
}

const enrichAbi = (pfunc) => {
  const enriched = {...pfunc};
  const haspayable = enriched.pfunction.gapi.inputs.find(inp => inp.name === PAYABLE_INPUT.name);
  if (haspayable) return enriched;

  if (enriched.pfunction.gapi.payable) {
    enriched.pfunction.gapi.inputs.push({...PAYABLE_INPUT});
  }
  return enriched;
}

const fdefinition = (gapi, visibility = 'public') => {
  const ins = finputs(gapi.inputs);
  const outs = foutputs(gapi.outputs);
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

const setTypes = ios => ios//.map(io => {
//   const cpy = JSON.parse(JSON.stringify(io));
//   cpy.type = typeMap[io.type];
//   return cpy;
// });

const finputsP = inputs => {
  const inputscpy = [...inputs];
  const weiValueIx = inputscpy.findIndex(inp => inp.payable);
  if (weiValueIx === -1) return {inputs: inputscpy, weiValue: null};

  const weiValue = inputscpy.splice(weiValueIx, 1)[0];
  return {inputs: inputscpy, weiValue};
}
const finputs = inputs => setTypes(inputs).map(inp => `${inp.type} ${inp.name}`);
const foutputs = outputs => setTypes(outputs).map(out => out.type);

const buildGraphStep = (node) => {
  const {record} = node;
  const {gapi} = record.pfunction;
  const {inputs, weiValue} = finputsP(node.inputs);
  const ins = inputs.map(inp => inp.name);
  const outs = gapi.outputs_idx;
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

const buildFunction = (fdef, body, freturn) => {
  return `${fdef}
  {
${body}
    ${freturn}
  }
`
}

const buildFout = outputs => {
  const outs = outputs.map(out => {
    const output = out.inputs[0];
    return output.name;
  });

  return outs.length === 0 ? '' : `return ${outs.length === 1 ? outs[0] : `(${outs.join(', ')})`};`;
}

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
}
