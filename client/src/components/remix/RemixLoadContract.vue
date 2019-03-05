<template>
    <div class="load-remix">
        <v-select
            v-model="selectContract"
            :items="contracts"
            label="Load from Remix"
        ></v-select
        <p>To change what contracts to load, compile another file in Remix.</p>
        <v-tooltip bottom>
            <v-text-field
                ref="addr_input"
                v-if="contractName"
                :label="contractName + ' - deployed on ' + chainName"
                placeholder="0x0000000000000000000000000000000000000000"
                append-icon="fa-download"
                @click:append="loadFromRemix(contractName)"
                slot="activator"
                :rules="rules"
            ></v-text-field>
            <p>Set deployment address to load the {{contractName}} contract into the Pipeline plugin.</p>
        </v-tooltip>
    </div>
</template>

<script>
import Pipeos from '../../namespace/namespace';
import {compiledContractProcess} from '../../utils/utils';
import {deployOnJVM} from './utils.js';

export default {
    data() {
        let validationError = 'Invalid address';
        return {
            contracts: [],
            chain: '',
            chainName: '',
            contractName: '',
            showAddressInput: false,
            selectContract: null,
            web3: null,
            rules: [
                v => v ? (v.length === 42 || validationError) : '',
                v => v ? (v.substring(0, 2) === '0x' || validationError) : '',
            ],
        }
    },
    async mounted() {
        await Pipeos.remix.loaded();
        this.setNetworkInfo();
        this.setContractsFromRemix();

        Pipeos.remix.listen('solidity', 'compilationFinished', (success, data, source) => {
            console.log('compiler compilationFinished', sourceTarget, source, version, data);
            this.setNetworkInfo();
            this.setContractsFromRemix();
        });
    },
    watch: {
        chain(newValue) {
            if (newValue === 'JavaScriptVM') {
                this.chainName = newValue;
            } else {
                this.chainName = 'Chain ID ' + newValue;
            }
        },
        selectContract(name) {
            this.contractName = name;
        }
    },
    methods: {
        ethaddressInput() {
            return this.$refs['addr_input'];
        },
        async setNetworkInfo() {
            const provider = await Pipeos.remix.call(
                'app',
                'getExecutionContextProvider'
            );
            console.log('getExecutionContextProvider', provider);
            // provider = injected | web3 | vm
            if (provider === 'vm') {
                this.chain = 'JavaScriptVM';
                this.deployPipeProxy();
            } else if (provider === 'injected') {
                this.web3 = window.web3;
                this.chain = this.web3.version.network;
            } else {
                alert('Use an injected provider. Node by endpoint is not supported.');
                // Pipeos.remix.call(
                //     'app',
                //     'getProviderEndpoint',
                //     [],
                //     (error, provider) => {
                //         console.log('getProviderEndpoint', error, provider);
                //     }
                // );
            }
            this.$emit('provider-changed', this.chain, this.web3);
        },
        async setContractsFromRemix() {
            let contracts = [];
            this.getDataFromRemix(function(container) {
                contracts.push(container.name);
            });
            this.contracts = contracts;
        },
        loadFromRemix(contractName) {
            let input = this.ethaddressInput();
            let address = input.internalValue;
            let deployment_info;

            if (!address || !input.valid) {
                throw new Error('Ethereum address not valid.');
            }

            deployment_info = {
                pclassi: {
                    address,
                    chain_id: this.chain,
                }
            };

            this.getDataFromRemix((container) => {
                if (container.name == contractName) {
                    this.$emit('load-from-remix', container, deployment_info);
                }
            });
        },
        async getDataFromRemix(callback) {
            let result
            try {
                result = await Pipeos.remix.call(
                    'solidity',
                    'getCompilationResult'
                );
                return compiledContractProcess(result, callback);
            } catch (e) {
                throw e;
            }
        },
        deployPipeProxy() {
            if (this.chain === 'JavaScriptVM') {
                deployOnJVM(Pipeos.contracts.PipeProxy.compiled.bytecode, '300000', (result) => {
                    Pipeos.contracts.PipeProxy.addresses['JavaScriptVM'] = result.createdAddress;
                });
            }
        },
    }
}
</script>

<style>
.load-remix {
    margin-top: 5px;
}
</style>
