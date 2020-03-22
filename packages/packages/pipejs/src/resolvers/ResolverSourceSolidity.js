
const ioName = (io, node, port) => `${io.name}_${node}_${port}`;

class ResolverSourceSolidity {
  constructor(resolvers) {
    this.resolvers = resolvers;
    this.inputs = [];
    this.outputs = [];
    this.steps = [];
    this.usedResolvers = [];
    this.gapi = [];
  }

  setInput(key, value, typeobj) {
    this.inputs.push({ key, value, typeobj });
  }

  setOutput(key, value, typeobj) {
    this.outputs.push({ key, value, typeobj });
  }

  onNodeCall(fcontext, inputKeys, outputKeys) {
    const { pclass } = fcontext;

    if (!this.resolvers[pclass.type]) return;

    if (!this.usedResolvers.find(name => name === pclass.type)) {
      this.usedResolvers.push(pclass.type);
    }

    const stepSource = this.resolvers[pclass.type].onNodeCall(fcontext, inputKeys, outputKeys);
    if (stepSource) {
      this.steps.push(stepSource);
    }

    return stepSource;
  }

  getGapi() {
    this.gapi = this.resolvers.solidity.getGapi(this.inputs, this.outputs);
    return this.gapi;
  }

  getOutput() {
    const inputs = this.inputs.map(({ key, typeobj}) => ioName(typeobj, key, 0));
    const outputs = this.outputs.map(({ key, value, typeobj}) => ioName(typeobj, key, value));
    const runContext = this.usedResolvers
      .map(name => this.resolvers[name].onRunContext())
      .reduce((accum, val) => accum.concat(val), []);
    const imports = this.usedResolvers
      .map(name => this.resolvers[name].getImports())
      .reduce((accum, val) => accum.concat(val), []);


    const head = this.resolvers.solidity.getContractHead();
    const fdef = this.resolvers.solidity.getFunctionDef(this.inputs, this.outputs);

    return `${Object.values(imports).join('\n')}

contract PipedContract {
  ${head}

  ${fdef}
  {
    ${this.steps.join('\n')}

    return [${outputs.join(', ')}]
  }
}`
  }
}

export default ResolverSourceSolidity;
