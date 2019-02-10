import Pipeos from '../../namespace/namespace';

export function deployOnJVM(bytecode, gasLimit, callback) {
    Pipeos.remix.call(
        'udapp',
        'getAccounts',
        [],
        (error, [accounts]) => {
            if (error) {
                throw new Error(error);
            }
            const transaction = {
                from: accounts[0],
                data: bytecode,
                gasLimit,
                value: '0',
                useCall: false,
            };
            console.log('transaction', transaction)
            Pipeos.remix.call(
                'udapp',
                'runTx',
                [transaction],
                (error2, result) => {
                    if (error2) {
                        throw new Error(error2);
                    }
                    if (result[0].error) {
                        throw new Error(JSON.stringify(result[0].error));
                    }
                    if (!result[0] || !result[0].createdAddress) {
                        throw new Error('PipeProxy contract not created');
                    }
                    if (callback) {
                        callback(result[0]);
                    }
                },
            );
        },
    );
}
