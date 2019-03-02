<template>
    <div class='fit'>
        <v-tabs fixed-tab left class="fullheight">
            <v-tab ripple key="solidity">Solidity</v-tab>
            <v-tab ripple key="deployment">Deployment</v-tab>
            <v-tab ripple key="js">Js</v-tab>
            <v-tab ripple key="graph">Graph</v-tab>
            <v-tab-item
                key="solidity"
                class="fullheight swiper-margin"
            >
                <v-toolbar flat color="#fff" height="47">
                    <v-tooltip bottom>
                        <v-btn
                            small flat fab
                            slot="activator"
                            v-on:click="clipboardCopy('contractSource')"
                        >
                            <v-icon>fa-copy</v-icon>
                        </v-btn>
                        <span>Copy to clipboard</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <v-btn
                            small flat fab
                            slot="activator"
                            v-on:click="$emit('load-remix')"
                        >
                            <v-icon>fa-upload</v-icon>
                        </v-btn>
                        <p>Load in Remix.</p>
                        <p>Compile and deploy it now in Remix.</p>
                        <p>With the deployment info provided.</p>
                    </v-tooltip>
                </v-toolbar>
                <textarea ref='contractSource' class='source-txtar'>{{contractSourceLast}}</textarea>
            </v-tab-item>
            <v-tab-item
                key="deployment"
                class="fullheight swiper-margin"
            >
                <v-toolbar flat color="#fff" height="47">
                    <v-tooltip bottom>
                        <v-btn
                            small flat fab
                            slot="activator"
                            v-on:click="clipboardCopy('deploymentInfo')"
                        >
                            <v-icon>fa-copy</v-icon>
                        </v-btn>
                        <span>Copy constructor arguments to clipboard</span>
                    </v-tooltip>
                </v-toolbar>
                <textarea ref='deploymentInfo' class='source-txtar'>{{deploymentInfoLast}}</textarea>
            </v-tab-item>
            <v-tab-item
                key="js"
                class="fullheight swiper-margin"
            >
                <v-toolbar flat color="#fff" height="47">
                    <v-tooltip bottom>
                        <v-btn
                            small flat fab
                            slot="activator"
                            v-on:click="clipboardCopy('jsSource')"
                        >
                            <v-icon>fa-copy</v-icon>
                        </v-btn>
                        <span>Copy to clipboard</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <v-btn
                            small flat fab
                            slot="activator"
                            v-on:click="runSource('jsSource')"
                        >
                            <v-icon>fa-play</v-icon>
                        </v-btn>
                        <span>Run source</span>
                    </v-tooltip>
                    <v-dialog v-model="dialog" hide-overlay max-width="600px">
                        <!-- <v-tooltip bottom> -->
                            <v-btn
                                small flat fab
                                slot="activator"
                            >
                                <v-icon>fa-play-circle</v-icon>
                            </v-btn>
                            <!-- <span>Run source</span>
                        </v-tooltip> -->
                        <v-card>
                            <AbiFunction
                                v-if="graphsAbi.length"
                                v-for="(funcAbi, i) in graphsAbi"
                                :key="i"
                                :abi="funcAbi"
                                v-on:value-changed="jsArgumentsChange"
                            />
                        </v-card>
                    </v-dialog>
                </v-toolbar>
                <textarea ref='jsSource' class='source-txtar'>{{jsSourceLast}}</textarea>
            </v-tab-item>
            <v-tab-item
                key="graph"
                class="fullheight swiper-margin"
            >
                <v-toolbar flat color="#fff" height="47">
                    <v-tooltip bottom>
                        <v-btn
                            small flat fab
                            slot="activator"
                            v-on:click="clipboardCopy('graphSource')"
                        >
                            <v-icon>fa-copy</v-icon>
                        </v-btn>
                        <span>Copy to clipboard</span>
                    </v-tooltip>
                </v-toolbar>
                <textarea ref='graphSource' class='source-txtar'>{{graphSourceLast}}</textarea>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
import AbiFunction from '../abi/AbiFunction';
import { ethers } from 'ethers';
window.ethers = ethers;

export default {
    components: {
        AbiFunction,
    },
    props: ['contractSource', 'graphSource', 'jsSource', 'deploymentInfo', 'graphsAbi'],
    data: () => ({
        contractSourceLast: '',
        graphSourceLast: '',
        jsSourceLast: '',
        deploymentInfoLast: '',
        dialog: false,
    }),
    created: function() {
        this.setInitialData();
    },
    watch: {
        contractSource: function() {
            this.contractSourceLast = this.contractSource;
        },
        graphSource: function() {
            this.graphSourceLast = this.graphSource;
        },
        jsSource: function() {
            this.jsSourceLast = this.jsSource;
        },
        deploymentInfo: function() {
            this.deploymentInfoLast = this.deploymentInfo;
        },
    },
    methods: {
        setInitialData: function() {
            this.contractSourceLast = this.contractSource;
            this.graphSourceLast = this.graphSource;
            this.jsSourceLast = this.jsSource;
            this.deploymentInfoLast = this.deploymentInfo;
            let self = this;

            this.PipedScriptCallback = window.PipedScriptCallback = (funcName, returnValues) => {
                console.log('PipedScriptCallback', funcName, JSON.stringify(returnValues));

                let element = document.getElementById(`output_${funcName}`);
                element.innerHTML = '';

                Object.keys(returnValues).forEach((name) => {
                    element.insertAdjacentHTML('beforeend', `<p>${name}: ${this.prepareOutput(returnValues[name])}</p>`);
                });
            }
        },
        prepareOutput: function(value) {
            if (typeof value === 'object') {
                return JSON.stringify(value);
            }
            return value;
        },
        clipboardCopy: function(reference) {
            this.$refs[reference].select();
            document.execCommand("copy");
        },
        runSource: function(reference) {
            eval(this.$refs[reference].value);
        },
        jsArgumentsChange: function(args)  {
            args.forEach((arg, i) => {
                let pattern1 = `let ${arg.name} = `;
                let regex = new RegExp(pattern1 + '.*;');
                let replacement = `let ${arg.name} = ${arg.value};`;
                this.jsSourceLast = this.jsSourceLast.replace(regex, replacement);
            });
            setTimeout(() => this.runSource('jsSource'), 1000);
        },
    }
}
</script>


<style>
.fit {
    height: 100%;
    width: 100%;
}
.source-txtar {
    height: 87%;
    width: 100%;
    font-family: monospace;
}
</style>
