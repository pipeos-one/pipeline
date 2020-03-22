import Sanct from 'sanctuary';
import SDef from 'sanctuary-def';
import bigInt from 'big-integer';
import solidity from './solidity.js';

let wasm = {};
let rust = {};

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
  rust['u'+size] = solidity['uint'+(size*8)]
  rust['i'+size] = solidity['int'+(size*8)]
})) (Sanct.range (0) (5));

rust['isize'] = rust['i64'];
rust['usize'] = rust['u64'];
rust['f32'] = wasm['f32'];
rust['f64'] = wasm['f64'];
rust['bool'] = solidity['bool'];
rust['tuple'] = SDef.Any; // TODO: fixme

// TODO: Rust arrays: [i32; 5], struct, enum

export default {wasm, rust};
