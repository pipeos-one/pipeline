
const ioName = (io, node, port) => `${io.name}_${node}_${port}`;
const finputs = inputs => inputs.map(inp => `${inp.type} ${inp.name}`);
const foutputs = outputs => outputs.map(out => out.type);
const mutability = gapi => gapi.stateMutability !== 'non-payable' ? gapi.stateMutability : '';
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

class SourceSolidity {
  constructor() {
    this.pclasses = {};
    this.pclassesAbis = {};
  }

  onNodeCall(fcontext, inputKeys, outputKeys) {
    const { pfunction, pclass } = fcontext;

    if (!this.pclasses[pclass.name]) {
      this.pclasses[pclass.name] =  pclass;
      this.pclassesAbis[pclass.name] = [pfunction.gapi];
    } else {
      this.pclassesAbis[pclass.name].push(pfunction.gapi);
    }

    const inputs = inputKeys.map(io => `${io[2].type} ${ioName(io[2], io[0], io[1])}`);
    const outputs = outputKeys.map(io => `${io[2].type} ${ioName(io[2], io[0], io[1])}`);
    const outputString = outputs.length === 1 ? outputs[0] : `(${outputs.join(', ')})`;

    let extraOptions = '';
    if (pfunction.gapi.payable) {
      extraOptions = `.value(TODO)`;
    }

    return `
    ${outputString} = ${pclass.name}.${pfunction.gapi.name}${extraOptions}(
      ${inputs.join(', ')}
    );`;
  }

  onRunContext() {
    return ['provider', 'signer', 'ethers'];
  }

  getImports() {
    let imports = [`pragma solidity ^0.5.4;`];

    imports = imports.concat(Object.keys(this.pclassesAbis).map(name => {
      const abi = this.pclassesAbis[name];
      const pclass = this.pclasses[name];
      const finterfaces = abi.map(fabi => {
        const type = mutability(fabi);
        const inputs = finputs(fabi.inputs).join(', ');
        const outputs = foutputs(fabi.outputs).join(', ');
        return `
  function ${fabi.name}(${inputs})
    external ${type}
    returns (${outputs});
`
      });
      return `
interface ${pclass.name}Interface {
  ${finterfaces.join('')}
}`;
    }));

    return imports;
  }

  getContractHead() {
    const declarations = [], constructorArgs = [], constructorAssignments = [];
    Object.keys(this.pclassesAbis).forEach(name => {
      declarations.push(`${name}Interface public ${name};`);
      constructorArgs.push(`address _${name}_address`);
      constructorAssignments.push(`${name} = ${name}Interface(_${name}_address);`);
    });

    return `${declarations.join('\n  ')}

  constructor(${constructorArgs.join(', ')}) public {
    ${constructorAssignments.join('\n    ')}
  }
    `
  }

  getGapi(inputs, outputs) {
    const ins = inputs.map(({ key, typeobj}) => {
      return {type: typeobj.type, name: ioName(typeobj, key, 0)};
    });
    const outs = outputs.map(({ key, typeobj}) => {
      return {type: typeobj.type, name: ioName(typeobj, key, 0)};
    });

    const stateIndex = Object.values(this.pclassesAbis).reduce(
      (maxState, abi) => Math.max(maxState, abi.reduce(
        (maxStateC, fabi) => Math.max(maxStateC, stateMap[fabi.stateMutability]),
        0,
      )),
      0,
      );
    const stateMutability = stateMapR[stateIndex];

    return {
      name: 'function0',
      type: 'function',
      inputs: ins,
      outputs: outs,
      stateMutability,
      constant: stateIndex < 2,
      payable: stateIndex === 3,
    }
  }

  getFunctionDef(inputs, outputs) {
    const gapi = this.getGapi(inputs, outputs);
    const mutabilityFlag = mutability(gapi);

      return `
    function function0(${gapi.inputs.join(', ')})
    public ${mutabilityFlag}
    returns (${gapi.outputs.join(', ')})`
  }
}

export default SourceSolidity;
