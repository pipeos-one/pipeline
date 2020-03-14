import { ethers } from 'ethers';
import { gapiStripTemporary } from './utils.js';
import PIPE_INTERPRETER from './interpreter_config.js';

const SLOT_SIZE_MULTI = {
  tuple: true,
  string: true,
  bytes: true,
}

const IS_NOT_GRAPH_FLAG = '0xffffffffffff';

export function getInterpreter(web3) {
  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = provider.getSigner();
  const address = PIPE_INTERPRETER.deployment[web3.version.network];
  const fullC = new ethers.Contract(address, PIPE_INTERPRETER.compiled.abi, signer);
  const viewC = new ethers.Contract(address, PIPE_INTERPRETER.compiled.constabi, signer);
  return { full: fullC, view: viewC };
}

export const getSizeSlotBools = (types) => {
  return types.map((type) => {
    if (SLOT_SIZE_MULTI[type.type]) return false;
    if (type.type.slice(-1) === ']') return false;
    return true;
  });
};

export const buildinterpreterArgs = (graphObj, graphStepsAbi, graphAbi) => {
  console.log('buildinterpreterArgs', graphObj, graphStepsAbi, graphAbi);
  const allArgs = [];
  const allInputs = [];
  let isTransaction = false;

  // There may be some temporary outputs for transaction receipts
  const stepsAbi = {};
  Object.keys(graphStepsAbi).forEach(key => {
    const orig = graphStepsAbi[key];
    stepsAbi[key] = {
      ...orig,
      abi: gapiStripTemporary(orig.abi)
    };
  });

  graphObj.forEach((graph, i) => {
    const stepskey = [], portkey = [];
    const args = {
      inputs: '',
      inputSizeIsSlot: [false].concat(getSizeSlotBools(graphAbi[i].inputs)),
      starts: [0],
      steps: [],
      outputIndexes: [],
    };
    const inputs = {};
    let inputLen = 0;

    Object.keys(graph.n).forEach((key) => {
      key = parseInt(key);
      if (key < 2000) {
        stepskey.push(key);
      } else {
        portkey.push(key);
      }
    });

    graphAbi[i].inputs.forEach((_, i) => {
      inputs[`${portkey[i]}o${1}`] = i + 1;
    });
    inputLen = graphAbi[i].inputs.length + 1;

    allInputs[i] = [[], []]
    allInputs[i][0] = graphAbi[i].inputs.map(inp => {
      inp.functionName = graphAbi[i].name;
      return inp;
    });

    stepskey.forEach((key, j) => {
      const step = graph.n[key];

      stepsAbi[step.id].abi.outputs.forEach((_, i) => {
        inputs[`${key}o${i+1}`] = inputLen + i;
      });
      inputLen += stepsAbi[step.id].abi.outputs.length;

      const istep = {
        stepData: buildStepData(stepsAbi[step.id].deployment, stepsAbi[step.id].signature),
        inputIndexes: stepsAbi[step.id].abi.inputs.map(() => 0),
        payIndex: stepsAbi[step.id].abi.payable ? 1 : 0,
        outputHasSlotSize: getSizeSlotBools(stepsAbi[step.id].abi.outputs),
      }

      args.steps.push(istep);
      allInputs[i][1] = allInputs[i][1].concat(stepsAbi[step.id].abi.inputs.map((inp) => {
        inp.functionName = stepsAbi[step.id].abi.name;
        inp.contractName = stepsAbi[step.id].contractName;
        return inp;
      }));
      allInputs[i][1] = allInputs[i][1].concat(stepsAbi[step.id].abi.outputs.map((out) => {
        out.functionName = stepsAbi[step.id].abi.name;
        out.contractName = stepsAbi[step.id].contractName;
        return out;
      }));
      if (!stepsAbi[step.id].abi.constant) {
        isTransaction = true;
      }
    });

    // graph.e[i] = [step_i, output_i+1, step_i, input_i+1]
    graph.e.forEach((edge, i) => {
      const stepOut_i = parseInt(edge[0]);
      const stepOutArg_i = parseInt(edge[1]);
      const stepIn_i = parseInt(edge[2]);
      const stepInArg_i = parseInt(edge[3]);
      const inputKey = `${stepOut_i}o${stepOutArg_i}`;
      const inputIndex = inputs[inputKey];

      const stepno = stepskey.findIndex(k => k === stepIn_i);
      if (stepno < 0) {
        if (inputIndex) args.outputIndexes.push(inputIndex);
        return;
      }
      if (
        args.steps[stepno].payIndex > 0
        && stepInArg_i === args.steps[stepno].inputIndexes.length
      ) {
        // wei_value
        args.steps[stepno].payIndex = inputIndex;
        args.steps[stepno].inputIndexes.pop();
      } else {
        args.steps[stepno].inputIndexes[stepInArg_i - 1] = inputIndex;
      }
    });

    allArgs.push(args);
  });
  console.log('allArgs, allInputs, isTransaction', allArgs, allInputs, isTransaction)
  return {allArgs, allInputs, isTransaction};
};

const cumulativeSum = (sum => value => sum += value)(0);

export const buildinterpreterInputs = (inputs) => {
  let encodedInputs = '';
  let starts = [0];
  const inputHasSlotSize = [false].concat(getSizeSlotBools(inputs));

  inputs.forEach((input, i) => {
    const encodedValue = ethers.utils.defaultAbiCoder.encode([input.type], [input.value]);

    starts.push((encodedValue.length - 2) / 2);
    encodedInputs += encodedValue.slice(2);
  });
  starts = [0].concat(starts.map(cumulativeSum));
  return {inputs: `0x${encodedInputs}`, starts, inputHasSlotSize};
}

export function prepareGraphProxyInputs(types=[], values=[]) {
    if (types.length !== values.length) {
        throw new Error('Types and values must have the same length.')
    }
    let inputs, lengths, starts = [0, 0], inputHasSlotSize = [false];
    let abi_encoded = types.map((_, i) => ethers.utils.defaultAbiCoder.encode([types[i]], [values[i]]))

    // We need to increase the index of each element with 1; position 0 is not used
    // So payIndex can have a value of 0 if it is not set

    lengths = abi_encoded.map(encoded => (encoded.length - 2) / 2);
    starts = starts.concat(
      lengths.map((len, i) => lengths.slice(0, i + 1).reduce((accum, value) => accum + value, 0))
    )
    inputHasSlotSize = inputHasSlotSize.concat(lengths.map(len => len === 32))
    inputs = '0x' + abi_encoded.map(encoded => encoded.slice(2)).join('');

    return {inputs, starts, inputHasSlotSize}
}

function buildStepData(addressOrGraphId, functionSig) {
  if (addressOrGraphId.length === 42) {
    return IS_NOT_GRAPH_FLAG + addressOrGraphId.slice(2) + functionSig.slice(2);
  }
  return ethers.utils.hexZeroPad(ethers.utils.hexlify(
    parseInt(addressOrGraphId)
  ), 30);
}
