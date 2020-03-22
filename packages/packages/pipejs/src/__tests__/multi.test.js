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

import solfixtures from './fixtures/solidity_fixtures.js';

const getDeployment = (id) => `http://192.168.1.140:3000/file/${id}/source`;

const graph1 = {"n":{"101":{"i":101,"id":"39879128-983d-43fe-ab42-055aaa340f2d"},"102":{"i":102,"id":"4a19014e-16ef-4e51-9c69-0d0c189b44b7"},"3000":{"i":3000,"id":"5bc59e192817116e84bdd8313000"}},"e":[[101,1,102,1],[3000,1,101,1],[3000,1,101,2]],"r":[]}
const graph1Context = {
  "39879128-983d-43fe-ab42-055aaa340f2d": {"_id":"39879128-983d-43fe-ab42-055aaa340f2d","pclassid":"8b1c3a80-faa8-48cb-98b6-b6e10e76a7d5","pfunction":{"gapi":{"constant":true,"inputs":[{"name":"n1","type":"u32"},{"name":"n2","type":"u32"}],"name":"sum_u32","outputs":[{"name":"sum_u32","type":"u32"}],"payable":false,"stateMutability":"pure","type":"function"},"signature":"0x1f21ec9a","graph":{},"sources":{}},"timestamp":"2020-02-25T11:52:45.614Z","pclass":{"_id":"8b1c3a80-faa8-48cb-98b6-b6e10e76a7d5","name":"sums","type":"wasm","deployment":getDeployment("2bdde8e4-5abf-4884-8bbf-5779982321e4")}},
  "4a19014e-16ef-4e51-9c69-0d0c189b44b7": {"_id":"4a19014e-16ef-4e51-9c69-0d0c189b44b7","pclassid":"8bc574a4-aa97-46c7-a549-9d06b7e7f994","pfunction":{"gapi":{"constant":true,"inputs":[{"name":"n1","type":"u32"},{"name":"n2","type":"u32"}],"name":"sub_u32","outputs":[{"name":"sub_u32","type":"u32"}],"payable":false,"stateMutability":"pure","type":"function"},"signature":"0x2c719ac2","graph":{},"sources":{}},"timestamp":"2020-02-25T11:52:45.614Z","pclass":{"_id":"8bc574a4-aa97-46c7-a549-9d06b7e7f994","name":"subs","type":"wasm","deployment":getDeployment("e58a06e2-8631-4c33-b0e1-b52bf315414d")}}
}

const graph2 = {"n":{"101":{"i":101,"id":"9fee587c-f0fa-4478-8487-c73a8e60c597"},"102":{"i":102,"id":"840725c7-7ed0-4315-b7cf-6f0380851bfb"},"103":{"i":103,"id":"39879128-983d-43fe-ab42-055aaa340f2d"},"104":{"i":104,"id":"4a19014e-16ef-4e51-9c69-0d0c189b44b7"},"3000":{"i":3000,"id":"5bc59e192817116e84bdd8313000"},"3003":{"i":3003,"id":"5bc59e192817116e84bdd8313003"}},"e":[[101,1,102,2],[103,1,104,1],[3000,1,101,1],[3000,1,102,1],[3003,1,103,2],[3003,1,104,2]],"r":[]}

const scContext = {
  "9fee587c-f0fa-4478-8487-c73a8e60c597": {"_id":"9fee587c-f0fa-4478-8487-c73a8e60c597","pclassid":"0163e781-eb7e-4429-85cd-f0f6ff8a26d9","pfunction":{"gapi":{"constant":true,"inputs":[{"name":"product_id","type":"uint256"}],"name":"getVendor","outputs":[{"name":"vendor","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},"signature":"0x65de1eb3","graph":{},"sources":{}},"timestamp":"2020-03-09T15:02:44.221Z","pclass":{"_id":"0163e781-eb7e-4429-85cd-f0f6ff8a26d9","name":"VendorRegistration","type":"solidity","deployment":"0x274782b8155ddcc9d868f9e676e6688d78c22488"}},
  "840725c7-7ed0-4315-b7cf-6f0380851bfb": {"_id":"840725c7-7ed0-4315-b7cf-6f0380851bfb","pclassid":"9247016e-ba61-4413-9cae-3361e199e5c5","pfunction":{"gapi":{"constant":true,"inputs":[{"name":"product_id","type":"uint256"},{"name":"vendor","type":"address"},{"name":"wei_value","type":"uint256"}],"name":"calculateQuantity","outputs":[{"name":"quantity","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},"signature":"0x69739c89","graph":{},"sources":{}},"timestamp":"2020-03-09T15:02:44.221Z","pclass":{"_id":"9247016e-ba61-4413-9cae-3361e199e5c5","name":"VendorPrices","type":"solidity","deployment":"0x7a93134e763a75df41b625319839024e628ce171"}},
  "e342f716-47d6-4525-9b42-5157a97e07bf": {"_id":"e342f716-47d6-4525-9b42-5157a97e07bf","pclassid":"5170421c-b791-4e17-9d8b-416016b95a77","pfunction":{"gapi":{"constant":false,"inputs":[{"name":"vendor","type":"address"},{"name":"buyer","type":"address"},{"name":"product_id","type":"uint256"},{"name":"quantity","type":"uint256"},{"name":"WEI_VALUE","type":"uint256","payable":true}],"name":"buy","outputs":[{"name":"done","type":"bool","temporary":true}],"payable":true,"stateMutability":"payable","type":"function"},"signature":"0xa9d424e2","graph":{},"sources":{}},"timestamp":"2020-03-09T15:02:44.221Z","pclass":{"_id":"5170421c-b791-4e17-9d8b-416016b95a77","name":"MarketPlace","type":"sol","deployment":"0x0b77f47455f3e39c817f1b4d29b81461105438c0"}}
}

const graph3 = {"n":{"101":{"i":101,"id":"9fee587c-f0fa-4478-8487-c73a8e60c597"},"102":{"i":102,"id":"840725c7-7ed0-4315-b7cf-6f0380851bfb"},"103":{"i":103,"id":"e342f716-47d6-4525-9b42-5157a97e07bf"},"3000":{"i":3000,"id":"5bc59e192817116e84bdd8313000"},"3001":{"i":3001,"id":"5bc59e192817116e84bdd8313001"}},"e":[[101,1,102,2],[3000,1,101,1],[3000,1,102,1],[102,1,103,4],[101,1,103,1],[3000,1,101,1],[3000,1,102,1],[3000,1,103,3],[3001,1,102,3],[3001,1,103,5]],"r":[]}

const wasmpaths = {
  '39879128-983d-43fe-ab42-055aaa340f2d': 'sums',
  '4a19014e-16ef-4e51-9c69-0d0c189b44b7': 'subs',
}
const scids = {
  'vr': '9fee587c-f0fa-4478-8487-c73a8e60c597',
  'vp': '840725c7-7ed0-4315-b7cf-6f0380851bfb',
  'mp': 'e342f716-47d6-4525-9b42-5157a97e07bf',
}

const fetchWasmFs = (deployment) => {
  const wasmPath = path.resolve(__dirname, `/fixtures/${wasmpaths[deployment]}.wasm`);
  return fs.readFileSync(wasmPath);
}

const fetchWasmUrl = (deployment) => {
  return fetch(deployment);
}

test('test wasm+js graph - execution & source', async () => {
  const customFetch = fetchWasmUrl;
  const wasmRuntime = new RuntimeWasmJavascript(customFetch);
  const jsRuntime = new RuntimeJavascript();
  const resolvers = {wasm: wasmRuntime, javascript: jsRuntime};
  const runtimeResolver = new ResolverRuntimeMulti(resolvers);
  const pipe = pipejs([soltypes, wtypes.rust, wtypes.wasm, jstypes]);

  const inputs = [8, 3];
  const result = await pipe.build_and_run_graph(graph1Context)(graph1)(runtimeResolver)(inputs);
  console.log('result', result);
  expect(result[0]).toEqual(13);

  const wasmSource = new SourceWasmJavascript();
  const jsSource = new SourceJavascript();
  const sresolvers = {wasm: wasmSource, javascript: jsSource};
  const sourceResolver = new ResolverSourceJs(sresolvers);

  const source = await pipe.build_and_run_graph(graph1Context)(graph1)(sourceResolver)(inputs);
  const runnableSource = `(()=> ${source})()`;
  console.log('runnableSource', runnableSource);
  let runnableFunction = new Function('return ' + runnableSource)();
  const evalresult = await runnableFunction(customFetch, WebAssembly, ...inputs);
  console.log('evalresult', evalresult);
  expect(evalresult).toEqual(result[0]);
}, 30000);

// TODO: pclass deployments as variables in the function

test('test wasm+js+solidity graph - execution & source', async () => {
  const graph2Context = { ...graph1Context, ...scContext };
  const customFetch = fetchWasmUrl;
  // const provider = new ethers.providers.Web3Provider(
  //   ganache.provider({network_id: 3, unlocked_accounts: [1, 2]})
  // );
  // const signer = provider.getSigner(0);

  // const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545', 3);
  // const signer = provider.getSigner(0);

  // deploy contracts, set new addresses
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

  // graph2Context[scids.vr].pclass.deployment = contractVR.address;
  // graph2Context[scids.vp].pclass.deployment = contractVP.address;

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
  const result = await pipe.build_and_run_graph(graph2Context)(graph2)(runtimeResolver)(inputs);
  console.log('result', result);
  expect(result[0].toNumber()).toEqual(10);
  expect(result[1]).toEqual(10);

  const wasmSource = new SourceWasmJavascript();
  const jsSource = new SourceJavascript();
  const web3Source = new SourceWeb3Javascript();
  const sresolvers = {wasm: wasmSource, javascript: jsSource, solidity: web3Source};
  const sourceResolver = new ResolverSourceJs(sresolvers);

  const source = await pipe.build_and_run_graph(graph2Context)(graph2)(sourceResolver)(inputs);
  let runnableFunction = new Function('return ' + source)();
  console.log('runnableFunction', runnableFunction);
  const evalresult = await runnableFunction(provider, signer, ethers, customFetch, WebAssembly, ...inputs);
  console.log('evalresult', evalresult);
  expect(evalresult[0].toNumber()).toEqual(10);
  expect(evalresult[1]).toEqual(10);
}, 30000);

test('test solidity source graph', async () => {
  const pipe = pipejs([soltypes]);
  const solSource = new SourceSolidity();
  const sresolvers = {solidity: solSource};
  const sourceResolver = new ResolverSourceSolidity(sresolvers);
  const inputs = [1, 100, '0x1fB8CD37C35546FeC07A794158F4035f06f023A0'];
  const source = await pipe.build_and_run_graph(scContext)(graph3)(sourceResolver)(inputs);
  console.log(source);
});
