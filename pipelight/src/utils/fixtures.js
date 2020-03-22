import { getWasmModule } from './wasm.js';
import wasmfixtures from '../fixtures/wasmfixtures.js';

const CHAINLENS_API = process.env.REACT_APP_CHAINLENS_SERVER;
const fixtures = {
  3: ['0163e781-eb7e-4429-85cd-f0f6ff8a26d9', '9247016e-ba61-4413-9cae-3361e199e5c5', '5170421c-b791-4e17-9d8b-416016b95a77'],
  4: ['e2acc5fb-67fc-4629-a705-68279c7d0bb6', '2d9ff2df-afd1-4304-b9e6-d5d2d10f5577', 'ac3ec84a-a4e7-4dfc-9fcf-d5239d48d647'],
  5: ['c4fd4455-dba4-4b64-8358-990c2db86531', '489275aa-6eec-4282-aa45-3a6584657206', '2d2d7dc1-fa57-4b13-8a88-cfd691f27260'],
  42: ['ea164f80-a0fc-4613-a7d6-a42419970d47', '7bce2412-c568-4df8-9ea9-824d2c531cd3', 'd4743f0a-40a5-4c5a-a4d1-888843f034e3'],
}

export async function getContractFixtures(chainid) {
  const api = `${CHAINLENS_API}/pclass`;
  const filter = {
    include:[
      {relation:"pfunctions"},
      {relation:"pclassInstances"}
    ]
  };

  const contracts = [];
  for (let id of fixtures[chainid]) {
    const response = await fetch(`${api}/${id}?filter=${JSON.stringify(filter)}`);
    const contract = await response.json();
    contracts.push(contract);
  }

  return contracts;
}

export async function getWasmFixtures() {
  const wpclasses = [];
  for (let winfo of wasmfixtures) {
    const wpclass = await getWasmModule(winfo);
    if (wpclass) wpclasses.push(wpclass);
  }
  return wpclasses;
}
