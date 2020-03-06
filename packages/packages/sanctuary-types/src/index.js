const Sanct = require ('sanctuary');
const SDef = require ('sanctuary-def');
const bigInt = require('big-integer');

const two = bigInt(2);

let pipeos = {};
let solidity = {};
let wasm = {};
let rust = {};
let javascript = {};

const cast = type => obj => {
  const names = Object.keys (type.types);
  const types = Object.values (type.types);
  const values = Object.values (obj);
  return values.length === types.length &&
         values.every ((v, idx) => Sanct.is (types[idx]) (v))
         ? Sanct.unchecked.fromPairs (Sanct.unchecked.zip (names) (values))
         : Sanct.Nothing;
};

const like = t1 => t2 =>
  t1.type === 'RECORD' &&
  t2.type === 'RECORD' &&
  Sanct.equals (Object.values (t1.types)) (Object.values (t2.types));

const getType = name => {
  return pipeos[name];
}

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


// WebAssembly value types

wasm['i32'] = solidity['int32'];
wasm['i64'] = solidity['int64'];
wasm['f32'] = solidity['int32'];
wasm['f64'] = solidity['int32'];

Sanct.map (((y)=>{
  wasm['f'+y*32] = SDef.NullaryType
    ('f'+y*32)
    ('f'+y*32)
    ([])
    (x => Sanct.is (wasm['i'+y*32]) (x) ||
          (
            x === parseFloat(x.toString())) &&
            Sanct.is (wasm['i'+y*32]) (x.toString().split('.')[0]
          ))
})) (Sanct.range (1) (3));

// Rust value types

Sanct.map (((y)=>{
  const size = Math.pow(2, y) * 8;

  rust['u'+size] = SDef.NullaryType
    ('u'+size)
    ('u'+size)
    ([])
    (x => Sanct.is (solidity['u'+size]) (x));

  rust['i'+size] = SDef.NullaryType
    ('i'+size)
    ('i'+size)
    ([])
    (x => Sanct.is (solidity['i'+size]) (x));
})) (Sanct.range (0) (5));

rust['isize'] = rust['i64'];
rust['usize'] = rust['u64'];
rust['f32'] = wasm['f32'];
rust['f64'] = wasm['f64'];
rust['bool'] = solidity['bool'];
rust['tuple'] = SDef.Any; // TODO: fixme

// TODO: Rust arrays: [i32; 5], struct, enum
[
  ['number', SDef.Number],
  ['number[]', SDef.Array(SDef.Number)],
  ['string', SDef.String],
  ['string[]', SDef.Array(SDef.String)],
  ['object', SDef.Object],
  ['object[]', SDef.Array(SDef.Object)],
  ['any', SDef.Any],
].map(x => pipeos[x[0]] = x[1]);


Object.assign(pipeos, solidity, wasm, rust, javascript);
const utils = {cast, like};

export {
  pipeos,
  solidity,
  wasm,
  rust,
  javascript,
  utils,
}
