import Pipeos from '../../namespace/namespace';

export async function deployOnJVM(bytecode, gasLimit, callback) {
    const account = await Pipeos.remixClient.call(
        'udapp',
        'getAccounts',
    );
    const transaction = {
        from: account,
        data: bytecode,
        gasLimit,
        value: '0',
        useCall: false,
    };

    let receipt;
    try {
        receipt = await Pipeos.remixClient.call(
            'udapp',
            'sendTransaction',
            transaction,
        );
        if (!receipt || !receipt.createdAddress) {
            throw new Error('PipeProxy contract not created');
        }
        if (receipt.error) {
            throw new Error(`PipeProxy contract not created: ${receipt.error}`);
        }
    } catch (e) {
        throw e;
    }
    if (callback) {
        callback(receipt);
    }
}
