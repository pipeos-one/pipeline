
const ioName = (io, node, port) => `${io.name}_${node}_${port}`;

class ResolverSourceJs {
  constructor(resolvers) {
    this.resolvers = resolvers;
    this.inputs = [];
    this.outputs = [];
    this.steps = [];
    this.usedResolvers = [];
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

  getOutput() {
    const inputs = this.inputs.map(({ key, typeobj}) => ioName(typeobj, key, 0));
    const outputs = this.outputs.map(({ key, value, typeobj}) => ioName(typeobj, key, value));
    const runContext = this.usedResolvers
      .map(name => this.resolvers[name].onRunContext())
      .reduce((accum, val) => accum.concat(val), []);
    const imports = this.usedResolvers
      .map(name => this.resolvers[name].getImports())
      .reduce((accum, val) => accum.concat(val), []);

    return `async (${runContext.join(', ')}, ${inputs.join(', ')}) => {
    ${Object.values(imports).join('\n')}

    ${this.steps.join('\n')}

  return [${outputs.join(', ')}]
}`
  }
}

export default ResolverSourceJs;
