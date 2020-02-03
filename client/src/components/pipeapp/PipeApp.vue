<template>
    <v-layout row wrap class='fit'>
      <v-flex xs12 class='fit'>
        <v-tabs fixed-tab left class="fullheight">
            <v-tab ripple key="solidity">Sol</v-tab>
            <v-tab ripple key="deployment">Deploy</v-tab>
            <v-tab ripple key="js">Js</v-tab>
            <v-tab ripple key="graph">Graph</v-tab>
            <v-tab ripple key="qrcode">QR</v-tab>
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
                        <v-card v-if="dialog">
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
                                @change="jsArgumentsChange"
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
                            v-on:click="clipboardCopy('graphsSource')"
                        >
                            <v-icon>fa-copy</v-icon>
                        </v-btn>
                        <span>Copy to clipboard</span>
                    </v-tooltip>
                    <div class="text-center">
                      <v-dialog
                        v-model="dialogGraph"
                        width="70%"
                      >
                        <template v-slot:activator="{ on }">
                          <v-btn
                              small flat fab
                              slot="activator"
                              v-on="on"
                          >
                              <v-icon>fa-save</v-icon>
                          </v-btn>
                        </template>
                        <v-card v-if="dialogGraph">
                          <v-card-actions>
                            <v-btn
                                small flat fab
                                @click="savePipeGraph"
                            >
                                <v-icon>fa-save</v-icon>
                            </v-btn>
                          </v-card-actions>
                          <v-card-text>
                            <v-container>
                              <PipeGraph v-model="pipegraphData" :abi="graphsAbi[0]" @change="jsArgumentsChange"/>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </div>
                </v-toolbar>
                <textarea
                    ref='graphsSource'
                    class='source-txtar'
                    v-on:change="setGraphs"
                >{{graphsSourceLast}}</textarea>
            </v-tab-item>
            <v-tab-item
                key="qrcode"
                class="fullheight swiper-margin"
            >
              <v-layout>
                <v-flex xs12 v-if="qrcodeValue">
                  <qrcode :value="qrcodeValue" :options="{ width: 200 }"></qrcode>
                </v-flex>
              </v-layout>
            </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import { ethers } from 'ethers';
import VueQrcode from '@chenfengyuan/vue-qrcode';
import {AbiFunction} from 'vue-ethabi';
import PipeGraph from './PipeGraph';
import Pipeos from '../../namespace/namespace';

Vue.component(VueQrcode.name, VueQrcode);

window.ethers = ethers;

export default {
    components: {
        AbiFunction,
        PipeGraph,
        VueQrcode,
    },
    props: ['chainid', 'contractSource', 'graphsSource', 'jsSource', 'jsSourceFunction', 'deploymentInfo', 'graphsAbi'],
    data: () => ({
        contractSourceLast: '',
        graphsSourceLast: '',
        jsSourceLast: '',
        jsSourceFunctionLast: null,
        deploymentInfoLast: '',
        deploymentInfoMap: [],
        dialog: false,
        dialogGraph: false,
        pipegraphId: null,
        pipegraphData: null,
        qrcodeValue: null,
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
        graphsSource: function() {
            this.graphsSourceLast = JSON.stringify(this.graphsSource);
        },
        jsSource: function() {
            this.setJsSource();
        },
        jsSourceFunction: function() {
          this.jsSourceFunctionLast = this.jsSourceFunction;
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
        dialogGraph() {
          this.setGraphData();
        },
        pipegraphId() {
          this.qrcodeValue = `${Pipeos.pipem}${this.pipegraphId}`;
        }
    },
    methods: {
        setDeploymentInfo: function() {
            this.deploymentInfoMap = this.deploymentInfo;
            this.deploymentInfoLast = this.deploymentInfo
                .map(deployment => `"${deployment.deployment}"`)
                .join(',');
        },
        setJsSource: function() {
          this.jsSourceLast = this.jsSourceFunction ? this.jsSourceFunction(this.jsSource, this.deploymentInfo.map(deployment => `"${deployment.deployment}"`)) : '';
        },
        setInitialData: function() {
            this.contractSourceLast = this.contractSource;
            this.graphsSourceLast = JSON.stringify(this.graphsSource);
            this.setJsSource();
        },
        pipedScriptCallback: function(funcName, returnValues) {
            let element = document.getElementById(`output_${funcName}`);
            element.innerHTML = '';

            Object.keys(returnValues).forEach((name) => {
                const value = returnValues[name];
                const pid = `returnValue_${funcName}_${name}`;
                element.insertAdjacentHTML('beforeend', `<p class="flex" id="${pid}" style="overflow-y: auto;">${name}: ${this.prepareOutput(value)}</p>`);
                if (value instanceof Object && value.wait) {
                    value.wait(2).then(receipt => {
                        document.getElementById(pid).innerHTML = 'Receipt: ' + JSON.stringify(receipt);
                    });
                }
            });
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
            window.ethers = ethers;
            return eval(this.$refs[reference].value);
        },
        jsArgumentsChange: async function(fargs)  {
            console.log('jsArgumentsChange', fargs, JSON.stringify(fargs));
            if (this.dialog) {
                const newArgs = this.deploymentInfoMap.map((deployment) => {
                    const userValue = this.$refs[deployment.funcName][0].$refs.input.value;
                    return userValue || deployment.deployment;
                }).map(arg => `"${arg}"`).join(', ');
                const regex = /const graphArguments =.*;/;
                const replacement = `const graphArguments = [${newArgs}];`;
                this.jsSourceLast = this.jsSourceLast.replace(regex, replacement);
            }
            const functionArgs = fargs.map(arg => {
                if (!arg.type.includes('int') && arg.type !== 'bool') {
                    return `"${arg.value}"`;
                }
                return arg.value;
            }).join(', ');

            setTimeout(async () => {
                const runnableSource = `(${this.$refs.jsSource.value})(${functionArgs})`;
                const returnValues = {};

                // TODO activeCanvas
                try {
                    const results = await eval(runnableSource);
                    this.graphsAbi[0].outputs.forEach((out, i) => {
                        returnValues[out.name] = results[i];
                    });
                } catch (error) {
                    console.error(error);
                    returnValues['Error'] = JSON.stringify(error);
                }

                this.pipedScriptCallback(this.graphsAbi[0].name, returnValues);
            }, 1000);
        },
        setGraphs: function() {
            let graphs = this.$refs['graphsSource'].value;
            if (graphs) {
                // TODO handle validation after using a proper v-textarea with error messages
                // validate json & graph format (build json schema)
                this.$emit('set-graphs', JSON.parse(graphs));
            }
        },
        savePipeGraph: function() {
          const graphData = this.pipegraphData;
          graphData.json = this.$refs['graphsSource'].value;
          graphData.chainids = [this.chainid];

          axios.post(Pipeos.pipeserver.api.graph, graphData).then((response) => {
            this.pipegraphId = response.data._id;
            this.dialogGraph = false;
            this.$emit('saved', response.data);
          });
        },
        setGraphData() {
          // TODO: multiple graphs here - treat them differently
          // TODO: link graphs somehow
          this.pipegraphData = this.pipegraphData || {
            name: 'Graph Name',
            markdown: '# Graph Dapp',
          };
        },
    },
};
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
