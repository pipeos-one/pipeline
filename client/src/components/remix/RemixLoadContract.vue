<template>
    <div>
        <v-select
            v-model="selectContract"
            :items="contracts"
            placeholder="Load from Remix"
        ></v-select>
        <v-tooltip bottom>
            <v-text-field
                ref="addr_input"
                v-if="contractName"
                placeholder="0x0000000000000000000000000000000000000000"
                append-icon="fa-download"
                @click:append="loadFromRemix(contractName)"
                slot="activator"
                :rules="rules"
                style="margin-top: -15px"
            ></v-text-field>
            <p>Set deployment address to load the {{contractName}} contract into the Pipeline plugin.</p>
        </v-tooltip>
        <p class="text-xs-left caption font-weight-medium wrap">To change what contracts to load, compile another file in Remix.</p>
        <p v-if="remixInterfaceWarning.active" class="text-xs-left caption font-weight-medium wrap red">{{remixInterfaceWarning.msg}}</p>
        <SimpleModal
            :modalIsActive="modalIsActive"
            :modalMessage="modalMessage"
            @change="recheckNetwork"
        />
    </div>
</template>

<script>
import Pipeos from '../../namespace/namespace';
import SimpleModal from '../modals/SimpleModal';
import {compiledContractProcess} from '../../utils/utils';
import {deployOnJVM} from './utils';
import {getWeb3} from '../../utils/web3connect';

export default {
    components: {
        SimpleModal,
    },
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
            modalIsActive: false,
            modalMessage: '',
            remixInterfaceWarning: {active: false, msg: ''},
        }
    },
    async mounted() {
        this.setData();
    },
    // beforeUpdate() {
    //     this.setData();
    // },
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
        async setData() {
            await Pipeos.remixClient.onload();
            if (Pipeos.remixClient.isLoaded) {
              await this.listenNetworkInfo();
              this.setContractsFromRemix();

              Pipeos.remixClient.solidity.on('compilationFinished', (target, source, version, data) => {
                  this.setContractsFromRemix();
              })
            }
        },
        ethaddressInput() {
            return this.$refs['addr_input'];
        },
        async listenNetworkInfo() {
            const provider = await Pipeos.remixClient.call(
                'network',
                'getNetworkProvider'
            );
            await this.setNetworkInfo(provider);
            Pipeos.remixClient.on('network', 'providerChanged', this.setNetworkInfo);
        },
        async setNetworkInfo(provider) {
            // provider = injected | web3 | vm
            if (!provider) {
                this.modalIsActive = true;
                this.modalMessage = 'Load Deploy & Run Transactions plugin.';
                return;
            }
            if (provider == 'web3') {
                this.modalIsActive = true;
                this.modalMessage = 'Use an injected provider. Node by endpoint is not supported.';
                return;
            }
            if (provider === 'vm') {
                this.chain = 'JavaScriptVM';
                this.deployPipeProxy();
            } else if (provider === 'injected') {
                this.web3 = await getWeb3();
                this.chain = this.web3.version.network;
            }
            this.modalIsActive = false;
            this.modalMessage = '';
            this.$emit('provider-changed', this.chain, this.web3);
        },
        recheckNetwork() {
            this.listenNetworkInfo();
        },
        setContractsFromRemix() {
            this.getDataFromRemix().then((containers) => {
                this.contracts = containers.map(container => container.name);
            });
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
                    chainid: this.chain,
                }
            };

            this.getDataFromRemix().then((containers) => {
                containers.forEach((container) => {
                    if (container.name == contractName) {
                        this.$emit('load-from-remix', container, deployment_info);
                    }
                });
            });
        },
        async getDataFromRemix() {
            let result;
            try {
                result = await Pipeos.remixClient.call(
                    'solidity',
                    'getCompilationResult'
                );
                if (result.data && result.source) {
                    return compiledContractProcess(result);
                }
            } catch (e) {
                throw e;
            }
            return [];
        },
        deployPipeProxy() {
            if (this.chain === 'JavaScriptVM') {
                let count =  0;
                let iid = setInterval(() => {
                    count ++;
                    if (count > 5) {
                        clearInterval(iid);
                    }
                    deployOnJVM(Pipeos.contracts.PipeProxy.compiled.bytecode, '300000', (result) => {
                        if (result && result.createdAddress) {
                            Pipeos.contracts.PipeProxy.addresses['JavaScriptVM'] = result.createdAddress;
                            clearInterval(iid);
                        }
                    });
                }, 4000);
            }
        },
    }
}
</script>
