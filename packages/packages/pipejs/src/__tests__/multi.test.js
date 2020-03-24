import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import ganache from 'ganache-cli';
import { ethers } from 'ethers';
import pipejs from '../pipe.js';
import soltypes from '../types/solidity.js';
import wtypes from '../types/wasm.js';
import jstypes from '../types/javascript.js';
import ResolverRuntimeMulti from '../resolvers/ResolverRuntimeMulti.js';
import ResolverSourceJs from '../resolvers/ResolverSourceJs.js';
import ResolverSourceSolidity from '../resolvers/ResolverSourceSolidity.js';
import { SourceWasmJavascript, RuntimeWasmJavascript } from '../resolvers/wasm.js';
import { SourceJavascript, RuntimeJavascript } from '../resolvers/javascript.js';
import { SourceWeb3Javascript, RuntimeWeb3Javascript } from '../resolvers/web3_js.js';
import SourceSolidity from '../resolvers/solidity.js';

import {
  wasmContext,
  scContext,
  graphInGraphContext,
  graphWasm,
  graphMixPure,
  graphScPayable,
  graphInGraph,
  getDeployment,
} from './fixtures/graphs.js';

import solfixtures from './fixtures/solidity_fixtures.js';

const wasmpaths = {
  '39879128-983d-43fe-ab42-055aaa340f2d': 'sums',
  '4a19014e-16ef-4e51-9c69-0d0c189b44b7': 'subs',
}
wasmpaths[getDeployment("2bdde8e4-5abf-4884-8bbf-5779982321e4")] = 'sums';
wasmpaths[getDeployment("e58a06e2-8631-4c33-b0e1-b52bf315414d")] = 'subs';
const scids = {
  'vr': '9fee587c-f0fa-4478-8487-c73a8e60c597',
  'vp': '840725c7-7ed0-4315-b7cf-6f0380851bfb',
  'mp': 'e342f716-47d6-4525-9b42-5157a97e07bf',
}

const fetchWasmFs = (deployment) => {
  const wasmPath = path.resolve(__dirname, `./fixtures/${wasmpaths[deployment]}.wasm`);
  return fs.readFileSync(wasmPath);
}

const fetchWasmUrl = (deployment) => {
  return fetch(deployment);
}

test('test wasm+js graph - execution & source', async () => {
  const customFetch = fetchWasmFs;
  const wasmRuntime = new RuntimeWasmJavascript(customFetch);
  const jsRuntime = new RuntimeJavascript();
  const resolvers = {wasm: wasmRuntime, javascript: jsRuntime};
  const runtimeResolver = new ResolverRuntimeMulti(resolvers);
  const pipe = pipejs([soltypes, wtypes.rust, wtypes.wasm, jstypes]);

  const inputs = [8, 3];
  const result = await pipe.build_and_run_graph(wasmContext)(graphWasm)(runtimeResolver)(inputs);
  console.log('result', result);
  expect(result[0]).toEqual(13);

  const wasmSource = new SourceWasmJavascript();
  const jsSource = new SourceJavascript();
  const sresolvers = {wasm: wasmSource, javascript: jsSource};
  const sourceResolver = new ResolverSourceJs(sresolvers);

  const source = await pipe.build_and_run_graph(wasmContext)(graphWasm)(sourceResolver)(inputs);
  const runnableSource = `(()=> ${source})()`;
  // console.log('runnableSource', runnableSource);
  let runnableFunction = new Function('return ' + runnableSource)();
  const evalresult = await runnableFunction(customFetch, WebAssembly, ...inputs);
  console.log('evalresult', evalresult);
  expect(evalresult).toEqual(result[0]);
}, 30000);

// TODO: pclass deployments as variables in the function

test('test wasm+js+solidity graph - execution & source', async () => {
  const graphContext = { ...wasmContext, ...scContext };
  const customFetch = fetchWasmFs;

  // const provider = new ethers.providers.Web3Provider(
  //   ganache.provider({network_id: 3, unlocked_accounts: [1, 2]})
  // );
  // const signer = provider.getSigner(0);
  //
  // // const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', 3);
  // // const signer = provider.getSigner(0);
  //
  // // deploy contracts, set new addresses
  // let factoryVR = new ethers.ContractFactory(
  //   solfixtures[0].data.gapi,
  //   solfixtures[0].pclassInstances[0].data.compilerOutput.runtime.bytecode,
  //   signer
  // );
  // let contractVR = await factoryVR.deploy();
  //
  // let factoryVP = new ethers.ContractFactory(
  //   solfixtures[0].data.gapi,
  //   solfixtures[0].pclassInstances[0].data.compilerOutput.runtime.bytecode,
  //   signer
  // );
  // let contractVP = await factoryVP.deploy();
  //
  // graphContext[scids.vr].pclass.deployment = contractVR.address;
  // graphContext[scids.vp].pclass.deployment = contractVP.address;

  const apiAccessToken = 'ebca4c2a0f4b4cf9ba4669ac26d3dde2';
  const provider = new ethers.providers.InfuraProvider('ropsten', apiAccessToken);
  const signer = provider;

  const wasmRuntime = new RuntimeWasmJavascript(customFetch);
  const jsRuntime = new RuntimeJavascript();
  const web3Runtime = new RuntimeWeb3Javascript(provider, signer, ethers);

  const resolvers = {wasm: wasmRuntime, javascript: jsRuntime, solidity: web3Runtime};
  const runtimeResolver = new ResolverRuntimeMulti(resolvers);

  const pipe = pipejs([soltypes, wtypes.rust, wtypes.wasm, jstypes]);

  const inputs = [1, 100, 10, 5];
  const result = await pipe.build_and_run_graph(graphContext)(graphMixPure)(runtimeResolver)(inputs);
  expect(result[0].toNumber()).toEqual(10);
  expect(result[1]).toEqual(10);

  const wasmSource = new SourceWasmJavascript();
  const jsSource = new SourceJavascript();
  const web3Source = new SourceWeb3Javascript();
  const sresolvers = {wasm: wasmSource, javascript: jsSource, solidity: web3Source};
  const sourceResolver = new ResolverSourceJs(sresolvers);

  const source = await pipe.build_and_run_graph(graphContext)(graphMixPure)(sourceResolver)(inputs);
  let runnableFunction = new Function('return ' + source)();
  const evalresult = await runnableFunction(provider, signer, ethers, customFetch, WebAssembly, ...inputs);
  expect(evalresult[0].toNumber()).toEqual(10);
  expect(evalresult[1]).toEqual(10);
}, 30000);

test('test wasm+js+solidity graph in graph', async () => {
  const graphContext = graphInGraphContext;
  const customFetch = fetchWasmFs;

  const apiAccessToken = 'ebca4c2a0f4b4cf9ba4669ac26d3dde2';
  const provider = new ethers.providers.InfuraProvider('ropsten', apiAccessToken);
  const signer = provider;

  const wasmRuntime = new RuntimeWasmJavascript(customFetch);
  const jsRuntime = new RuntimeJavascript();
  const web3Runtime = new RuntimeWeb3Javascript(provider, signer, ethers);

  const resolvers = {wasm: wasmRuntime, javascript: jsRuntime, solidity: web3Runtime};
  const runtimeResolver = new ResolverRuntimeMulti(resolvers);

  const pipe = pipejs([soltypes, wtypes.rust, wtypes.wasm, jstypes]);

  const inputs = [1, 100, 10, 5];
  const result = await pipe.build_and_run_graph(graphContext)(graphInGraph)(runtimeResolver)(inputs);
  console.log('result', result);
  expect(result[0]).toEqual(15);

  const wasmSource = new SourceWasmJavascript();
  const jsSource = new SourceJavascript();
  const web3Source = new SourceWeb3Javascript();
  const sresolvers = {wasm: wasmSource, javascript: jsSource, solidity: web3Source};
  const sourceResolver = new ResolverSourceJs(sresolvers);

  const source = await pipe.build_and_run_graph(graphContext)(graphInGraph)(sourceResolver)(inputs);
  let runnableFunction = new Function('return ' + source)();
  // console.log('runnableFunction', runnableFunction);
  const evalresult = await runnableFunction(customFetch, WebAssembly, provider, signer, ethers, ...inputs);
  console.log('evalresult', evalresult);
  expect(evalresult).toEqual(15);
}, 100000);

test('test solidity source graph', async () => {
  const pipe = pipejs([soltypes]);
  const solSource = new SourceSolidity();
  const sresolvers = {solidity: solSource};
  const sourceResolver = new ResolverSourceSolidity(sresolvers);
  const inputs = [1, 100, '0x1fB8CD37C35546FeC07A794158F4035f06f023A0'];
  const source = await pipe.build_and_run_graph(scContext)(graphScPayable)(sourceResolver)(inputs);
  // console.log(source);
});
