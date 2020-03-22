class ResolverRuntimeMulti {
  constructor(resolvers) {
    this.resolvers = resolvers;
    this.runtime = {};
    this.inputs = [];
    this.outputs = [];
  }

  getRuntime() {
    return this.runtime;
  }

  getRuntimeValue(key, index) {
    if (!index) return this.runtime[key]
    return this.runtime[key][index];
  }

  setRuntimeValue(key, value) {
    this.runtime[key] = value;
  }

  setInput(key, value, typeobj) {
    this.setRuntimeValue(key, value);
  }

  setOutput(key, typeobj) {
    this.outputs.push(key);
  }

  // inputKeys: [[3000, 1], [101, 1]]
  async onNodeCall(fcontext, inputKeys, outputKeys) {
    const { pfunction, pclass } = fcontext;

    if (!this.resolvers[pclass.type]) {
      throw new Error(`There is no appropriate resolver for ${pclass.type}`);
    }

    // TODO multiple functions applied on a group of inputs?

    // TODO inputKey can be a function
    // if (io[2].type === 'function') {
    //   argt  = new Function("return " + this.runtime[io[0]][io[1]])();
    // }
    const inputs = inputKeys.map(io => this.runtime[io[0]][io[1]]);

    let response = await this.resolvers[pclass.type].onNodeCall(fcontext, inputs);

    if (!(response instanceof Array)) response = [response];
    this.runtime[outputKeys[0][0]] = response;
    return response;
  }

  getOutput() {
    console.log('Intermediary states: ', this.getRuntime());
    return this.outputs.map(key => this.getRuntimeValue(key)[0]);
  }
}

export default ResolverRuntimeMulti;
