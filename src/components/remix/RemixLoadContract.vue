<template>
    <div class="load-remix">
        <!-- <v-tooltip right>
            <v-btn
              small
              slot="activator"
              v-on:click="loadFromRemix"
            ><v-icon>play_for_work</v-icon>Remix Smart Contract
        </v-btn>
        <span>dvdfd</span>
        </v-tooltip> -->
        <template v-for="contractName in contracts">
            <v-tooltip bottom>
                <v-text-field
                    :ref="'addr_input_' + contractName"
                    :label="contractName + ' - deployed on ' + chainName"
                    placeholder="0x0000000000000000000000000000000000000000"
                    append-icon="play_for_work"
                    @click:append="loadFromRemix(contractName)"
                    slot="activator"
                    key="contractName"
                     :rules="rules"
                ></v-text-field>
                <p>Set deployment address to load the {{contractName}} contract into the Pipeline plugin.</p><p>To change what contracts to load, please compile another file in Remix.</p>
            </v-tooltip>
        </template>
    </div>
</template>

<script>
import Pipeos from '../../namespace/namespace';

export default {
    data() {
        let validationError = 'Invalid address';
        return {
            contracts: [],
            chain: '',
            chainName: '',
            web3: null,
            rules: [
                v => v ? (v.length === 42 || validationError) : '',
                v => v ? (v.substring(0, 2) === '0x' || validationError) : '',
            ],
        }
    },
    mounted() {
        this.setNetworkInfo();
        this.setContractsFromRemix();

        Pipeos.remix.listen('compiler', 'compilationFinished', ([success, data, source]) => {
            console.log('compiler compilationFinished', success, data, source);
            this.setNetworkInfo();
            this.setContractsFromRemix();
        });

        Pipeos.remix.listen('txlistener', 'newTransaction', function(data) {
            console.log('txlistener newTransaction', data);
        });
    },
    watch: {
        chain: function(newValue) {
            if (newValue === 'JavaScriptVM') {
                this.chainName = newValue;
            } else {
                this.chainName = 'Chain ID ' + newValue;
            }
        }
    },
    methods: {
        ethaddressInput(contractName) {
            return this.$refs['addr_input_' + contractName][0];
        },
        setNetworkInfo: function() {
            Pipeos.remix.call(
                'app',
                'getExecutionContextProvider',
                [],
                (error, [provider]) => {
                    console.log('getExecutionContextProvider', error, provider);
                    // provider = injected | web3 | vm
                    if (provider === 'vm') {
                        this.provider = 'JavaScriptVM';
                        this.chain = 'JavaScriptVM';
                    } else if (provider === 'injected') {
                        this.web3 = window.web3;
                        this.chain = this.web3.version.network;
                    } else {
                        alert('Please use an injected provider. Node by endpoint is not supported.');
                        // Pipeos.remix.call(
                        //     'app',
                        //     'getProviderEndpoint',
                        //     [],
                        //     (error, provider) => {
                        //         console.log('getProviderEndpoint', error, provider);
                        //     }
                        // );
                    }
                }
            );
        },
        setContractsFromRemix: function() {
            let contracts = [];
            this.getDataFromRemix(function(container) {
                contracts.push(container.name);
            });
            this.contracts = contracts;
        },
        loadFromRemix: function(contractName) {
            let input = this.ethaddressInput(contractName);
            let ethaddress = input.internalValue;
            let deployment_info;

            if (!ethaddress || !input.valid) {
                throw new Error('Ethereum address not valid.');
            }

            deployment_info = {
                deployed: {
                    ethaddress,
                    chainid: this.chain,
                }
            };

            this.getDataFromRemix((container) => {
                if (container.name == contractName) {
                    this.$emit('load-from-remix', container, deployment_info);
                }
            });
        },
        getDataFromRemix(callback) {
            Pipeos.remix.call(
                'compiler',
                'getCompilationResult',
                [],
                function(error, result) {
                    console.log(error, result);
                    if (error) {
                        throw new Error(error);
                    }
                    let compiled = result[0];
                    const target = compiled.source.target;
                    // let additional_solsources;
                    // if (Object.keys(compiled.source.sources).length > 1) {
                    //     additional_solsources = Object.assign({}, compiled.source.sources);
                    //     delete additional_solsources[target];
                    // }
                    Object.entries(compiled.data.contracts).forEach(entryArray => {
                        let target = entryArray[0];
                        let targetObj = entryArray[1];
                        Object.entries(targetObj).forEach(entry => {
                            console.log(entry);
                            let name = entry[0];
                            let contract = entry[1];
                            let data = {
                                name,
                                container: {
                                    abi: contract.abi,
                                    devdoc: contract.devdoc,
                                    userdoc: contract.userdoc,
                                    solsource: compiled.source.sources[target].content,
                                    // additional_solsources,
                                    bytecode: contract.evm.bytecode,
                                    deployedBytecode: contract.evm.deployedBytecode,
                                    metadata: contract.metadata,
                                },
                                tags: [],
                            };

                            // Remove duplicate abi, devdoc, userdoc
                            delete data.container.metadata.output;
                            console.log('data', data);
                            callback(data);
                        });
                    });
                }
            );
        },
    }
}
</script>

<style>
.load-remix {
    margin-left: 50px;
}
</style>
