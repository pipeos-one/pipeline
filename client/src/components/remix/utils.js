import Pipeos from '../../namespace/namespace';

export async function deployOnJVM(bytecode, gasLimit, callback) {
    const accounts = await Pipeos.remix.call(
        'udapp',
        'getAccounts');
    const transaction = {
        from: accounts[0],
        data: bytecode,
        gasLimit,
        value: '0',
        useCall: false,
    };
    console.log('transaction', transaction);
    let result
    try {
        result = await Pipeos.remix.call(
            'udapp',
            'runTestTx',
            transaction);
        if (result.error) {
            throw new Error(JSON.stringify(result.error));
        }
        if (!result || !result.createdAddress) {
            throw new Error('PipeProxy contract not created');
        }
    } catch (e) {
        throw e
    }
    if (callback) {
        callback(result);
    }
}
