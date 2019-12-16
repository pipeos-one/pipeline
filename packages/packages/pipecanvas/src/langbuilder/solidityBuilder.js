const typeMap = {
  'number': 'i32',
  'number[]': 'Vec<i32>',
  'string': 'String',
  'function': 'Fn(i32) -> i32',
}

const buildImports = (pclassMap) => {
  const interfaces = Object.keys(pclassMap).map(pclassid => {
    const {pclass, fimports} = pclassMap[pclassid];
    const fdefs = fimports.map(node => {
      const fname = node.pfunction.gapi.name;
      const ins = finputs(node.pfunction.gapi.inputs);
      const outs = foutputs(node.pfunction.gapi.outputs);
      const retursSource = outs.length === 0 ? '' : `returns (${outs.join(', ')})`;
      return `function ${fname}(${ins.join(', ')}) external ${retursSource};`;
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
  const record = node.record;
  const ins = node.inputs.map(inp => {
    if (inp.type.includes('[')) return `&${inp.name}`;
    return inp.name;
  });
  const outs = record.pfunction.gapi.outputs_idx;// .map(out => out.name);

  const fcall = `${record.pclass.name}.${record.pfunction.gapi.name}(${ins.join(', ')});`;

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
  buildContainer,
  fdefinition,
  finputs,
  foutputs,
  buildGraphStep,
  buildFout,
  setTypes,
}
