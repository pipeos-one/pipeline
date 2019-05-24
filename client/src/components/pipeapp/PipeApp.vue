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
                            <v-flex xs12
                                v-for="(instance, i) in deploymentInfoMap"
                                :key="`deployment_${i}`"
                            >
                                <v-text-field
                                    :ref="instance.funcName"
                                    outline
                                    persistent-hint
                                    height="60%"
                                    type="text"
                                    :value="instance.deployment"
                                    :placeholder="instance.deployment"
                                    :hint="`${instance.contractName}:  ${instance.funcName}`"
                                ></v-text-field>
                            </v-flex>
                            <AbiFunction
                                v-if="graphsAbi.length"
                                v-for="(funcAbi, i) in graphsAbi"
                                :key="`function_${i}`"
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
                <textarea
                    ref='graphSource'
                    class='source-txtar'
                    v-on:change="setGraphs"
                >{{graphSourceLast}}</textarea>
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
        deploymentInfoMap: '',
        dialog: false,
    }),
    created: function() {
        this.setInitialData();
    },
    mounted: function() {
        this.setDeploymentInfo();
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
            this.setDeploymentInfo();
        },
        dialog: function() {
            let elements = document.getElementsByClassName('abiFunctionOutput');
            for (let i = 0; i < elements.length; i++) {
                elements[i].innerHTML = '';
            };
        },
    },
    methods: {
        setDeploymentInfo: function() {
            this.deploymentInfoMap = this.deploymentInfo.slice(1);
            this.deploymentInfoLast = this.deploymentInfo.map(deployment => {
                return `"${deployment.deployment}"`;
            }).join(',');

        },
        setInitialData: function() {
            this.contractSourceLast = this.contractSource;
            this.graphSourceLast = this.graphSource;
            this.jsSourceLast = this.jsSource;
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
            this.deploymentInfoMap.forEach((deployment) => {
                let userValue = this.$refs[deployment.funcName][0].$refs.input.value;

                if (deployment.deployment != userValue) {
                    let varName = `deployment_${deployment.funcName}`;
                    let pattern1 = `const ${varName} = `;
                    let regex = new RegExp(pattern1 + '.*;');
                    let replacement = `const ${varName} = "${userValue}";`;

                    this.jsSourceLast = this.jsSourceLast.replace(regex, replacement);
                }
            });
            args.forEach((arg, i) => {
                let pattern1 = `let ${arg.name} = `;
                let regex = new RegExp(pattern1 + '.*;');
                let replacement = `let ${arg.name} = ${arg.value};`;
                this.jsSourceLast = this.jsSourceLast.replace(regex, replacement);
            });
            setTimeout(() => this.runSource('jsSource'), 1000);
        },
        setGraphs: function() {
            let graphs = this.$refs['graphSource'].value;
            if (graphs) {
                // TODO handle validation after using a proper v-textarea with error messages
                // validate json & graph format (build json schema)
                this.$emit('set-graphs', JSON.parse(graphs));
            }
        }
    },
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
    font-family: Monaco,Menlo,"Ubuntu Mono",Consolas,source-code-pro,monospace;
    font-size: 12px;
}
</style>
