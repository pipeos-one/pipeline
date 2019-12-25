import pipejs from '../index.js';

const pipe = pipejs();
const dbFunction = {"_id":"5c95397d4212cc40afeec91f","pclassid":"5c95397d4212cc40afeec912","pfunction":{"signature":"getVendor(uint256)","gapi":{"constant":true,"inputs":[{"name":"product_id","type":"uint256"}],"name":"getVendor","outputs":[{"name":"vendor","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},"graph":{},"sources":{}},"timestamp":"2019-03-22T14:38:36.112Z","pclass":{"_id":"5c95397d4212cc40afeec912","name":"VendorRegistration","type":"sol","deployment":"0x274782b8155ddcc9d868f9e676e6688d78c22488"}}

test('add_indexed_func', () => {
  pipe.add_indexed_func(dbFunction);
  const indexedFuncs = pipe.get_indexed_func();
  expect(Object.keys(indexedFuncs).length).toBe(1);
  expect(Object.keys(indexedFuncs)[0]).toBe(dbFunction._id);
  expect(indexedFuncs[dbFunction._id]).toEqual(dbFunction);
})

test('bad_add_indexed_func', () => {
  let dbFunctionBad;

  dbFunctionBad = JSON.parse(JSON.stringify(dbFunction));
  dbFunctionBad.pfunction.signature = 10;
  expect(() => {
    pipe.add_indexed_func(dbFunctionBad);
  }).toThrow('Invalid value');

  dbFunctionBad = JSON.parse(JSON.stringify(dbFunction));
  dbFunctionBad.pfunction.gapi = null;
  expect(() => {
    pipe.add_indexed_func(dbFunctionBad);
  }).toThrow('Invalid value');

  dbFunctionBad = JSON.parse(JSON.stringify(dbFunction));
  dbFunctionBad.pclass = null;
  expect(() => {
    pipe.add_indexed_func(dbFunctionBad);
  }).toThrow('Invalid value');
})
