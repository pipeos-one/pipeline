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
