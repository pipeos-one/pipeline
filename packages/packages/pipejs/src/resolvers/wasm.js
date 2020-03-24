
const ioName = (io, node, port) => `${io.name}_${node}_${port}`;

class SourceWasmJavascript {
  constructor() {
    this.pclasses = {};
  }

  onNodeCall(fcontext, inputKeys, outputKeys) {
    const { pfunction, pclass } = fcontext;

    if (!this.pclasses[pclass.name]) {
      this.pclasses[pclass.name] =  pclass;
    }

    const inputs = inputKeys.map(io => ioName(io[2], io[0], io[1]));
    const outputs = outputKeys.map(io => ioName(io[2], io[0], io[1]));
    const outputString = outputs.length === 1 ? outputs[0] : `[${outputs.join(', ')}]`;

    return `
  const ${outputString} = await module_${pclass.name}.instance.exports.${pfunction.gapi.name}(
    ${inputs.join(', ')}
  );`
  }

  onRunContext() {
    return ['fetch', 'WebAssembly'];
  }

  getImports() {
    return Object.keys(this.pclasses).map(name => {
      const pclass = this.pclasses[name];

      // node.js does not support WebAssembly.instantiateStreaming
      //   return `
      // const module_${pclass.name} = await WebAssembly.instantiateStreaming(
      //   fetch("${pclass.deployment}")
      // );`;

        return `
    const binary_${pclass.name} = await fetch("${pclass.deployment}");
    const module_${pclass.name} = await WebAssembly.instantiate(binary_${pclass.name});
      `;
    });
  }

  onSubGraph() {

  }
}

class RuntimeWasmJavascript {
  constructor(fetch) {
    this.fetch = fetch;
    this.pclasses = {};
  }

  async getModule(pclass) {
    if (!this.pclasses[pclass.name]) {
      // const wmodule = await WebAssembly.instantiateStreaming(this.fetch(pclass.deployment));
      const binary = await this.fetch(pclass.deployment);
      const wmodule = await WebAssembly.instantiate(binary);
      this.pclasses[pclass.name] = wmodule;
    }
    return this.pclasses[pclass.name];
  }

  async onNodeCall(fcontext, args) {
    if (fcontext.pfunction.gapi.type !== "function") return;

    const { pfunction, pclass } = fcontext;
    const wmodule = await this.getModule(pclass);
    return await wmodule.instance.exports[pfunction.gapi.name](...args);
  }

  onSubGraph() {
    // get graph context
  }
}

export {
  SourceWasmJavascript,
  RuntimeWasmJavascript,
}
