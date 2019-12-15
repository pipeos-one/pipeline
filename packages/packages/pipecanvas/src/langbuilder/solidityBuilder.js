const typeMap = {
  'number': 'i32',
  'number[]': 'Vec<i32>',
  'string': 'String',
  'function': 'Fn(i32) -> i32',
}

// TODO: fix node.record.pclassid
const pclassName = 'i32lib';

const buildImports = (node) => {
  return `pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

`
}

// TODO: fixme - map interfaces over same pclass
const buildExtra = (nodes) => {
  const interfaceFuncs = nodes.map(node => {
    const fname = node.record.pfunction.gapi.name;
    const ins = finputs(node.record.pfunction.gapi.inputs);
    const outs = foutputs(node.record.pfunction.gapi.outputs);
    const retursSource = outs.length === 0 ? '' : `returns (${outs.join(', ')})`;
    return `function ${fname}(${ins.join(', ')}) external ${retursSource};`;
  })

  return `interface ${pclassName}Interface {
  ${interfaceFuncs.join('\n  ')}
}`;
}

// TODO fixme
const buildContainer = (imports, fsource) => {

  return `${imports}

contract PipedContract {
  ${pclassName}Interface public ${pclassName};

  constructor(address _${pclassName}_address) public {
    ${pclassName} = ${pclassName}Interface(_${pclassName}_address);
  }

  ${fsource}
}`
}

const fdefinition = (name, inputs, outType) => {
  const returnSource = outType.length > 0 ? `returns (${outType.join(', ')})` : '';
  return `function ${name}(${inputs.join(', ')})
    public
    ${returnSource}
  {`;
}

const setTypes = ios => ios//.map(io => {
//   const cpy = JSON.parse(JSON.stringify(io));
//   cpy.type = typeMap[io.type];
//   return cpy;
// });

const finputs = inputs => setTypes(inputs).map(inp => `${inp.type} ${inp.name}`);
const foutputs = outputs => setTypes(outputs).map(out => out.type);

const buildGraphStep = (node) => {
  // console.log('---- buildGraphStep, node:', JSON.stringify(node));
  const record = node.record;
  const ins = node.inputs.map(inp => {
    if (inp.type.includes('[')) return `&${inp.name}`;
    return inp.name;
  });
  const outs = record.pfunction.gapi.outputs_idx;// .map(out => out.name);

  const fcall = `${pclassName}.${record.pfunction.gapi.name}(${ins.join(', ')});`;

  if (outs.length === 1) {
    return `    ${outs[0].type} ${outs[0].name} = ${fcall}`;
  }

  // TODO: fix multiple outputs
  const returnSource = outs.length === 0 ? '' : `(${outs.map(out => `${out.type} ${out.name}`).join(', ')}) = `;
  return `    ${returnSource}${fcall}`;
}

const buildFout = outputs => {
  const outs = outputs.map(out => {
    const output = out.inputs[0];
    return output.name;
  });

  const returnsSource = outs.length === 0 ? '' : `return ${outs.length === 1 ? outs[0] : `(${outs.join(', ')})`};`;

  return `    ${returnsSource}
  }`
}

export default {
  buildImports,
  buildExtra,
  buildContainer,
  fdefinition,
  finputs,
  foutputs,
  buildGraphStep,
  buildFout,
  setTypes,
}
