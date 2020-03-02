export const CHAIN_NAMES = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
}

export const getEtherscanApi = (chainid) => {
  let chainname = CHAIN_NAMES[chainid];
  if (chainid === 1) chainname = '';
  else chainname += '.';
  return `https://${chainname}etherscan.io`;
}

export const getEtherscanApiContract = (chainid, address) => {
  return `${getEtherscanApi(chainid)}/address/${address}#code`;
}

export const getEtherscanTx = (chainid, txhash) => {
  return `${getEtherscanApi(chainid)}/tx/${txhash}`;
}

export const PRERECEIPT_TYPE = {
  name: 'receipt',
  type: 'tuple',
  components: [
    {
      name: 'etherscan',
      type: 'link',
    },
    {
      name: 'hash',
      type: 'string',
    },
    {
      name: 'blockHash',
      type: 'string',
    },
    {
      name: 'blockNumber',
      type: 'uint256',
    },
    {
      name: 'confirmations',
      type: 'uint256',
    },
  ]
}

export const RECEIPT_TYPE = {
  name: 'receipt',
  type: 'tuple',
  components: [
    {
      name: 'etherscan',
      type: 'link',
    },
    {
      name: 'transactionHash',
      type: 'string',
    },
    {
      name: 'blockHash',
      type: 'string',
    },
    {
      name: 'blockNumber',
      type: 'uint256',
    },
    {
      name: 'confirmations',
      type: 'uint256',
    },
  ]
}
