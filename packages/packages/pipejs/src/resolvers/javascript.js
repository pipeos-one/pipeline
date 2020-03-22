
const ioName = (io, node, port) => `${io.name}_${node}_${port}`;

class SourceJavascript {
  onNodeCall(fcontext, inputKeys, outputKeys) {
    if (fcontext.pfunction.gapi.type !== "function") return;
    if (fcontext.pclass.name === 'pipejs_identity') return;
    if (fcontext.pclass.name === 'pipejs_common_input') return;

    const { pfunction, pclass } = fcontext;
    const source = pfunction.sources.javascript;
    const inputs = inputKeys.map(io => ioName(io[2], io[0], io[1]));
    const outputs = outputKeys.map(io => ioName(io[2], io[0], io[1]));
    const outputString = outputs.length === 1 ? outputs[0] : `[${outputs.join(', ')}]`;

    return `
    const ${outputString} = (() => ${source})()(${inputs.join(', ')})`;
  }

  onRunContext() {
    return [];
  }

  getImports() {
    return [];
  }

  onSubGraph() {

  }
}

class RuntimeJavascript {
  async onNodeCall(fcontext, args) {
    if (fcontext.pfunction.gapi.type !== "function") return;

    const { pfunction, pclass } = fcontext;
    const source = pfunction.sources.javascript;

    const func = new Function("return " + source)();
    // TODO fixme for multiple functions applied on a group of inputs
    return func.apply(this, args);
  }

  onSubGraph() {
    // get graph context
  }
}

export {
  SourceJavascript,
  RuntimeJavascript,
}
