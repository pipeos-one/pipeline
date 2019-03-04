import {reverseKeys} from './utils';

interface CHAINID_MAP {
    [key: string]: string;
}

export const BIP122_TO_CHAINID: CHAINID_MAP = {
    'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3': '1',
    '41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d': '3',
    '6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177': '4',
    'a3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9': '42',
}

export const CHAINID_TO_BIP122: CHAINID_MAP = reverseKeys(BIP122_TO_CHAINID)

export let bip122UriToChainId = (bip122Uri: any) => {
    return bip122Uri.replace(/^blockchain:\/\//, '').split('/');
}

export let chainIdToBip122Uri = (chainId: string, blockHash: string = '') => {
    return `blockchain://${CHAINID_TO_BIP122[chainId]}/block/${blockHash}`;
}
