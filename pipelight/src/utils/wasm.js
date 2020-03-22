import { getSignatureString, getSignature } from './utils.js';

export async function getWasmModule({ name, url, abi }) {
  const timestamp = new Date().getTime().toString();
  const pclassInstances = [
    {
      _id: `${name}_pclassi_${timestamp}`,
      data: {
        deployment: {address: url},
      },
      extra: {},
      metadata: {categories: ['wasm']},
      timestamp,
    }
  ];
  const pfunctions = abi.map(fabi => {
    const signatureString = getSignatureString(fabi);
    return {
      _id: `${name}_${fabi.name}_${timestamp}`,
      pclassid: `${name}_${timestamp}`,
      data: {
        name: fabi.name,
        gapi: fabi,
        signatureString,
        signature: getSignature(signatureString),
      },
      extra: {},
      metadata: {categories: ['wasm']},
      timestamp,
    }
  });

  return {
    _id: `${name}_${timestamp}`,
    data: {
      name: name,
      gapi: abi,
    },
    extra: {},
    metadata: {categories: ['wasm']},
    pclassInstances,
    pfunctions,
    timestamp,
  }
}
