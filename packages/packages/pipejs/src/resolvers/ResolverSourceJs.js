
const ioName = (io, node, port) => `${io.name}_${node}_${port}`;

class ResolverSourceJs {
  constructor(resolvers) {
    this.resolvers = resolvers;
    this.inputs = [];
    this.outputs = [];
    this.steps = [];
    this.usedResolvers = [];
    this.subresolvers = [];
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

  getRunContext() {
    const ownContext = this.usedResolvers
      .map(name => this.resolvers[name].onRunContext())
      .reduce((accum, val) => accum.concat(val), []);

    const subContexts = Object.values(this.subresolvers)
      .map(subres => subres.getRunContext())
      .reduce((accum, val) => accum.concat(val), []);;

    const context = new Set(ownContext.concat(subContexts));
    return [ ...context ];
  }

  getOutput() {
    const inputs = this.inputs.map(({ key, typeobj}) => ioName(typeobj, key, 0));
    const outputs = this.outputs.map(({ key, value, typeobj}) => ioName(typeobj, key, value));
    const runContext = this.getRunContext();
    const imports = this.usedResolvers
      .map(name => this.resolvers[name].getImports())
      .reduce((accum, val) => accum.concat(val), []);

    const outputString = outputs.length === 1 ? outputs[0] : `[${outputs.join(', ')}]`;

    return `async (${runContext.join(', ')}, ${inputs.join(', ')}) => {
    ${Object.values(imports).join('\n')}

    ${this.steps.join('\n')}

  return ${outputString};
}`
  }

  onSubGraph(fcontext, inputKeys, outputKeys) {
    this.subresolvers[fcontext._id] = new ResolverSourceJs(this.resolvers);
    return { subresolver: this.subresolvers[fcontext._id], inputs: [] };
  }

  onSubGraphResponse(fcontext, response, inputKeys, outputKeys) {
    if (!(response instanceof Array)) response = [response];

    const runContext = this.subresolvers[fcontext._id].getRunContext();
    const inputs = this.inputs.map(({ key, typeobj}) => ioName(typeobj, key, 0));
    const outputs = outputKeys.map(io => ioName(io[2], io[0], io[1]));
    const outputString = outputs.length === 1 ? outputs[0] : `[${outputs.join(', ')}]`;
    const stepSource = `const ${outputString} = await (${response})(${runContext.join(', ')}, ${inputs.join(', ')});`;

    this.steps.push(stepSource);
  }
}

export default ResolverSourceJs;
