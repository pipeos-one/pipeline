const Sanct = require ('sanctuary');
const SDef = require ('sanctuary-def');
import solidity from './solidity.js';

let javascript = {};

let types =
[
  ["string", SDef.String],
  ["bytes" , SDef.String],
  ["number", SDef.Number],
  ["number[]", SDef.Array(SDef.Number)],
  ["string", SDef.String],
  ["string[]", SDef.Array(SDef.String)],
  ["object", SDef.Object],
  ["object[]", SDef.Array(SDef.Object)],
  ["function", SDef.Any],
  ["address", solidity["bytes20"]],
  ["byte", solidity["bytes1"]],
  ["uint", solidity["uint256"]],
  ["int", solidity["int256"]],
  ["bool", solidity["uint8"]],
  ["tuple", SDef.Any], // has to bbe better defined SDef.RecordType
  ["any", SDef.Any]
]

types.map(x => javascript[x[0]] = x[1]);

export default javascript;
