import Pipeos from '../../namespace/namespace';

export function deployOnJVM(bytecode, gasLimit) {
    return new Promise(async (resolve, reject) => {
        const account = await Pipeos.remixClient.call(
            'udapp',
            'getAccounts',
        ).catch(e => reject(e));
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
                reject(new Error('PipeProxy contract not created'));
            }
            if (receipt.error) {
                reject(new Error(`PipeProxy contract not created: ${receipt.error}`));
            }
        } catch (e) {
            reject(e);
        }
        resolve(receipt);
    });
}
