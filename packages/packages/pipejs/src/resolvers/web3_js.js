
const ioName = (io, node, port) => `${io.name}_${node}_${port}`;

class SourceWeb3Javascript {
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

    const inputs = inputKeys.map(io => ioName(io[2], io[0], io[1]));
    const outputs = outputKeys.map(io => ioName(io[2], io[0], io[1]));
    const outputString = outputs.length === 1 ? outputs[0] : `[${outputs.join(', ')}]`;

    let extraOptions = '';
    if (pfunction.gapi.payable) {
      extraOptions = `, {value: TODO}`
    }

    return `
    const ${outputString} = await ${pclass.name}.${pfunction.gapi.name}(
      ${inputs.join(', ')}${extraOptions}
    );`;
  }

  onRunContext() {
    return ['provider', 'signer', 'ethers'];
  }

  getImports() {
    return Object.keys(this.pclassesAbis).map(name => {
      const abi = this.pclassesAbis[name];
      const pclass = this.pclasses[name];
      return `
    const abi_${pclass.name} = ${JSON.stringify(abi)};
    const ${pclass.name} = new ethers.Contract("${pclass.deployment}", abi_${pclass.name}, signer);`;
    });
  }
}



class RuntimeWeb3Javascript {
  constructor(provider, signer, ethers) {
    this.provider = provider;
    this.signer = signer;
    this.ethers = ethers;
    this.pclasses = {};
    this.pclassesAbis = {};
  }

  async getModule(pclass, pfunction) {
    if (!this.pclasses[pclass.name]) {
      this.pclassesAbis[pclass.name] = [pfunction.gapi];
    } else {
      this.pclassesAbis[pclass.name].push(pfunction.gapi);
    }
    this.pclasses[pclass.name] = new this.ethers.Contract(
      pclass.deployment,
      this.pclassesAbis[pclass.name],
      this.signer,
    );
    return this.pclasses[pclass.name];
  }

  async onNodeCall(fcontext, args) {
    // TODO EVENTS
    const { pfunction, pclass } = fcontext;
    const contract = await this.getModule(pclass, pfunction);
    // TODO payable value
    return await contract[pfunction.gapi.name](...args);
  }
}

export {
  SourceWeb3Javascript,
  RuntimeWeb3Javascript,
}
