const Sanct = require ('sanctuary');
const SDef = require ('sanctuary-def');
const bigInt = require('big-integer');

const two = bigInt(2);

let solidity = {};

// Solidity value types

Sanct.map (((y)=>{
  solidity['uint'+y*8] = SDef.NullaryType
    ('uint'+y*8)
    ('uint'+y*8)
    ([])
    (x => bigInt.isInstance(x) &&
          x.geq(0) &&
          x.lesser(two.pow(new bigInt(y*8))));

  solidity['int'+y*8] = SDef.NullaryType
    ('int'+y*8)
    ('int'+y*8)
    ([])
    (x => bigInt.isInstance(x) &&
          x.geq(-two.pow(new bigInt(y*8-1))) &&
          x.lesser(two.pow(new bigInt(y*8-1))));

  solidity['bytes'+y] = SDef.NullaryType
    ('bytes'+y)
    ('bytes'+y)
    ([])
    (x => bigInt.isInstance(x) &&
          x.geq(0) &&
          x.lesser(two.pow(new bigInt(y*8))));
})) (Sanct.range (1) (33));

// TODO: fixed, ufixed

[
  ['string', SDef.String],
  ['bytes' , SDef.String],
  ['function', SDef.Any],
  ['address', solidity['bytes20']],
  ['byte', solidity['bytes1']],
  ['uint', solidity['uint256']],
  ['int', solidity['int256']],
  ['bool', solidity['uint8']],
  ['tuple', SDef.Any], // has to be better defined SDef.RecordType
].map(x => solidity[x[0]] = x[1])


export default solidity;
