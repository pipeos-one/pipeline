<template>
    <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide class="swiper-margin no-swipe">
            <PipeAbout/>
        </swiper-slide>
        <swiper-slide class="swiper-margin no-swipe">
            <RemixLoadContract
                v-on:load-from-remix="loadFromRemixWrap"
                v-on:provider-changed="setNetworkInfo"
            />
                <v-layout row wrap>
                    <v-flex xs3>
                        <Tags v-on:tag-toggle="onTagToggle"/>
                    </v-flex>
                    <v-flex xs9>
                    <PaginatedList
                        :items="taggedFunctions"
                        :pages="pages"
                        :currentPage="currentPage"
                        :isRemix="isRemix"
                        v-bind:tags="selectedTags"
                        v-on:function-toggle="onTreeFunctionToggle"
                        v-on:change-page="changePage"
                        v-on:load-remix="loadRemix"
                    />
                    </v-flex>
                </v-layout>
        </swiper-slide class="swiper-margin">

        <swiper-slide class="swiper-margin no-swipe">
            <PipeTree :items="selectedTreeContainers" v-on:item-toggle="onFunctionToggle"/>
        </swiper-slide>

        <swiper-slide class="swiper-margin-slide swiper-margin no-swipe">
            <template class="fullheight">
                <v-tabs
                    fixed-tab
                    left
                    v-on:input="setActiveCanvas"
                    class="fullheight"
                >
                    <v-btn
                      v-on:click="newCanvasFunction"
                      flat icon
                    ><v-icon>fa-plus</v-icon></v-btn>
                    <v-tab
                        v-for="n in canvases"
                        :key="n"
                        ripple
                    >
                        Function {{ n }}
                    </v-tab>
                    <v-tab-item
                        v-for="n in canvases"
                        :key="n"
                        class="fullheight swiper-margin"
                    >
                        <PipeCanvas :id="'draw_' + n"/>
                    </v-tab-item>
                </v-tabs>
            </template>
        </swiper-slide>

        <swiper-slide class="swiper-margin no-swipe">
            <PipeApp
                :contractSource="contractSource"
                :deploymentInfo="deploymentInfo"
                :graphSource="graphSource"
                v-on:load-remix="pipedLoadRemix"
            />
        </swiper-slide>

        <v-btn absolute small top left fab
            color="white"
            slot="button-prev"
            class="nav prev"
        >
            <v-icon>fa-chevron-left</v-icon>
        </v-btn>
        <v-btn absolute small top right fab
            color="white"
            class="nav next"
            slot="button-next"
        >
            <v-icon>fa-chevron-right</v-icon>
        </v-btn>
    </swiper>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';
import Tags from '../components/Tags';
import PaginatedList from '../components/PaginatedList';
import PipeTree from '../components/PipeTree';
import PipeCanvas from '../components/pipecanvas/PipeCanvas';
import PipeApp from '../components/pipeapp/PipeApp';
import PipeAbout from '../components/about/PipeAbout';
import RemixLoadContract from '../components/remix/RemixLoadContract';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import {
    randomId,
    pipeFunctionColorClass,
    compiledContractProcess,
} from '../utils/utils';
import Graphs from '../components/pipecanvas/pipecanvaslib.js';

Vue.use(VueAwesomeSwiper);

const get_api = Pipeos.pipeserver.api.json;
const functionsApi = Pipeos.pipeserver.api.function;
const containerApi = Pipeos.pipeserver.api.container;
const containerFunctionsApi = Pipeos.pipeserver.api.container + '/pipefunctions';
const deployedApi = Pipeos.pipeserver.api.deployed;

let filterOptions = {
    offset: 0,
    limit: 2,
    skip: 0,
};

export default {
  components: {
    PipeAbout,
    Tags,
    PaginatedList,
    PipeTree,
    PipeCanvas,
    PipeApp,
    RemixLoadContract,
  },
  data() {
    return {
        isRemix: window.self !== window.top,
        web3: null,
        chain: null,
        chain_query: null,
        selectedTags: [],
        pages: 1,
        currentPage: 1,
        taggedFunctions: [],
        taggedFunctionsCache: [],
        selectedTreeContainers: [],
        selectedFunctions: [[]],
        activeCanvas: 0,
        canvases: 1,
        swiperOptions: {
            noSwiping: true,
            navigation: {
                nextEl: '.next',
                prevEl: '.prev',
            },
            noSwipingClass: "no-swipe",
            loop: false,
            slidesPerView: "auto",
        },
        selectedContainers: [],
        filterOptions,
        pipeJs: {},
        contractSource: '',
        deploymentInfo: '',
        graphSource: '',
        graphInstance: null,
        pipedContracts: {},
    };
  },
  mounted() {
    this.loadData();
    this.loadCanvas();
  },
  methods: {
    setNetworkInfo: function(chain, web3) {
        this.chain = chain;
        this.chain_query = chain === 'JavaScriptVM' ? '42' : chain;
        this.web3 = web3;
        this.loadData();
    },
    loadData: function() {
        this.countPipeContainers();

        let query = '?' +
            Object.keys(this.filterOptions).map(
                key => `filter[${key}]=${this.filterOptions[key]}`
        ).concat(
            this.selectedTags.map(tag => `filter[where][tags][inq]=${tag}`)
        ).concat(
            this.selectedTags.length > 0 ? ['filter[where][tags][inq]='] : []
        ).concat(
            this.chain_query ? [
                `filter[where][chainids][inq]=${this.chain_query}`, 'filter[where][chainids][inq]='
            ] : []
        ).join('&');

        Vue.axios.get(containerFunctionsApi + query).then((response) => {
            console.log('response', response);
            this.selectedContainers = response.data.pipecontainers.map(container => {
                container.deployment = response.data.pipedeployments.find(depl => depl.containerid == container._id);
                return container;
            });
            this.linkContainersFunctions(response.data.pipefunctions);
        });
    },
    countPipeContainers: function() {
        let query = '?' + this.selectedTags
        .map(
            tag => `where[tags][inq]=${tag}`
        ).concat(
            this.selectedTags.length > 0 ? ['where[tags][inq]='] : []
        ).concat(
            this.chain_query ? [
                `where[chainids][inq]=${this.chain_query}`,
                `where[chainids][inq]=`,
            ] : []
        ).join('&');

        Vue.axios.get(containerApi + '/count' + query).then((response) => {
            this.pages = Math.ceil(response.data.count / filterOptions.limit);
            console.log('countPipeFunctions', response.data, this.pages, filterOptions);
        });
    },
    loadCanvas: function() {
        this.graphInstance = new Graphs(
            this.selectedFunctions,
            {
                onGraphChange: () => {
                    this.contractSource = this.graphInstance.getSource('solidity');
                    this.graphSource = JSON.stringify(this.graphInstance.getSource('graphs'));
                    this.deploymentInfo = [Pipeos.contracts.PipeProxy.addresses[this.chain]]
                        .concat(this.graphInstance.getSource('constructor').map(function_id => {
                            let contract_address;
                            this.selectedFunctions.forEach(pipedFunction => {
                                let functionObj = pipedFunction.find(func => func._id == function_id);
                                if (functionObj) {
                                    console.log('functionObj', functionObj);
                                    contract_address = functionObj.container.deployment.deployed.ethaddress;
                                }
                            });
                            return contract_address;
                        })).map(address => `"${address}"`).join(',');
                    console.log('this.deploymentInfo', this.deploymentInfo);
                }
            }
        );
        this.graphInstance.addGraph(`draw_${this.activeCanvas + 1}`);
    },
    addToCanvas: function(pipefunction, index) {
        this.graphInstance.addFunction(pipefunction, index);
    },
    onTagToggle: function (selectedTags) {
      this.selectedTags = selectedTags;
      console.log('this.selectedTags', this.selectedTags);
      this.loadData();
    },
    changePage: function(page) {
        this.filterOptions.skip = this.filterOptions.limit * (page - 1);
        const newPage = this.filterOptions.skip / this.filterOptions.limit + 1;
        if (0 < newPage <= this.pages) {
            this.currentPage = newPage;
        }
        this.loadData();
    },
    onFunctionToggle: function (pipefunction) {
        console.log('activeCanvas', this.activeCanvas);
        console.log('selectedFunctions', this.selectedFunctions);
        let index = this.selectedFunctions[this.activeCanvas].findIndex(func => {
            func._id == pipefunction._id
        });
        if (index > -1) {
          this.selectedFunctions[this.activeCanvas].splice(index, 1);
        }
        else {
          this.selectedFunctions[this.activeCanvas].push(pipefunction);
        }
        console.log('this.selectedFunctions', this.selectedFunctions);
        this.addToCanvas(pipefunction, this.activeCanvas);
    },
    onTreeFunctionToggle: function (pipefunction) {
        let index = this.selectedTreeContainers.findIndex(container => container._id == pipefunction.container._id);
        if (index < 0) {
            let container = this.selectedContainers.find(container => container._id == pipefunction.container._id);
            container.functions = this.taggedFunctions.filter(func => func.containerid == container._id);
            this.selectedTreeContainers.push(container);
        }
        // this.loadPipeJs(pipefunction);
    },
    loadPipeJs: function(pipefunction) {
        const containerid = pipefunction.containerid;
        const script_api = `${containerApi}/${containerid}/js`;
        let script = document.createElement('script')
        script.src = script_api;
        script.async = true
        script.onload = () => {
            this.pipeJs[`${containerid}_${pipefunction.name}`] = window[pipefunction.name];
        }
        document.head.appendChild(script);
    },
    linkContainersFunctions: function(pipeFunctions) {
        this.taggedFunctions = pipeFunctions.map(func => {
            func.container = Object.assign({}, this.selectedContainers.find(cont => cont._id === func.containerid));
            func.styleClasses = pipeFunctionColorClass(func.abiObj);
            return func;
        });
        console.log('this.taggedFunctions', this.taggedFunctions)
    },
    setActiveCanvas: function(value) {
        console.log('setActiveCanvas', value);
        if (this.graphInstance.getGraphs().length <= value) {
            this.graphInstance.addGraph(`draw_${value + 1}`);
        }
        this.activeCanvas = value;
        this.graphInstance.activeTab(value)
        console.log(this.graphInstance.getPipe())
    },
    newCanvasFunction: function() {
        let functions = this.selectedFunctions;
        functions.push([]);
        this.selectedFunctions = functions;
        console.log('this.selectedFunctions', this.selectedFunctions)
        this.canvases += 1;
    },
    loadRemix: function(item) {
        this.loadRemixCall(item.container.name, item.container.container.solsource);
    },
    loadRemixCall: function(name, source) {
        let fileName = `browser/Pipeos_${name}.sol`;
        if (confirm(`Click "OK" if you want to load the "${fileName}" contract in Remix.`)) {
            Pipeos.remix.call(
                'editor',
                'setFile',
                [fileName, source],
                function (error, result) { console.log(error, result) }
            );
        }
    },
    loadFromRemix: function(container, deployment) {
        container._id = randomId();
        container.deployment = deployment;
        this.selectedContainers.push(container);
        container.functions = this.buildFunctionsFromContainer(container);
        this.selectedTreeContainers.push(container);
        console.log('selectedContainers', this.selectedContainers);
        console.log('selectedTreeContainers', this.selectedTreeContainers);
    },
    saveFromRemix: function(container, deployment) {
        if (!container.tags) container.tags = [];
        container.tags.push('solidity');

        Vue.axios.get(
            `${containerApi}?filter[where][container.bytecode.object]=${container.container.bytecode.object}`
        ).then((response) => {
            let existant = response.data[0];
            let chainid = deployment.deployed.chainid;

            // Insert new container only if there is no other container with the same bytecode
            if (!existant) {
                console.info('Inserting new container and functions');
                container.chainids = [chainid];
                return Vue.axios.post(containerFunctionsApi, container);
            }

            // Update chainids if this was a new chain
            if (!existant.chainids.includes(chainid)) {
                let chainids = existant.chainids.concat([chainid]);
                console.info('Update chainids on container', chainids);
                Vue.axios.patch(`${containerApi}/${existant._id}`, {chainids});
            }
            response.data = existant
            return response;
        }).then((response) => {
            console.log('posted container', response);
            // Connect deployed instance with container
            deployment.containerid = response.data._id;
            return Vue.axios.post(deployedApi, deployment);
        }).then((response) => {
            console.log('posted deployment', response);
            // Reload data after insert, to include information in the paginated list
            this.loadData();
        }).catch(function (error) {
            console.log(error);
        });
    },
    buildFunctionsFromContainer: function(container) {
        let abi = container.container.abi;
        let devdoc = container.container.devdoc;
        let userdoc = container.container.userdoc;
        let functions = [];

        abi.forEach(funcabi => {
            let signature;

            if (funcabi.name) {
                signature = `${funcabi.name}(${funcabi.inputs.map(input => input.type).join(',')})`;

                functions.push({
                    signature,
                    abiObj: funcabi,
                    devdoc: devdoc.methods[signature],
                    userdoc: userdoc.methods[signature],
                    containerid: container._id,
                    container: Object.assign({}, container),
                    _id: randomId(),
                    styleClasses: pipeFunctionColorClass(funcabi),
                });
            }
        });
        return functions;
    },
    loadFromRemixWrap: function(compiled_contract, deployment_info) {
        let message = `
            Loading ${compiled_contract.name} (deployed at ${deployment_info.deployed.ethaddress} on chain ${deployment_info.deployed.chainid}) to Pipeline.
        `;
        if (deployment_info.deployed.chainid === 'JavaScriptVM') {
            alert(`${message} The contract will only load in the plugin client and will disappear on Refresh.`);
            this.loadFromRemix(compiled_contract, deployment_info);
        } else if (confirm(`
            ${message}
            Click "OK" if you want to save it on the Pipeos server.
            Click "Cancel" and the contract will only load in the plugin client and will disappear on Refresh.`)
        ) {
            this.saveFromRemix(compiled_contract, deployment_info);
        } else {
            this.loadFromRemix(compiled_contract, deployment_info);
        }
    },
    pipedLoadRemix: function() {
        let name = `PipedContract_${randomId()}`;
        this.loadRemixCall(name, this.contractSource);
        this.pipedContracts[name] = null;

        if (this.chain === 'JavaScriptVM') return;

        Pipeos.remix.listen('txlistener', 'newTransaction', (data) => {
            console.log('txlistener newTransaction', data);
            Pipeos.remix.call(
                'compiler',
                'getCompilationResult',
                [],
                (error, result) => {
                    console.log(error, result);
                    if (error) {
                        throw new Error(error);
                    }
                    if (result[0].source.target)
                    compiledContractProcess(result[0], function(contract) {
                        console.log('contract', contract);
                        if (this.pipedContracts[contract.name]) {
                            if (confirm(`
                                You have deployed ${contract.name}.
                                Click "OK" if you want to save it on the Pipeos server.`)
                            ) {
                                this.saveFromRemix(contract, {
                                    deployed: {
                                        ethaddress: data[0].contractAddress,
                                        chainid: this.chain,
                                    }
                                });
                            }
                        }
                    });
                }
            );
        });
    },
  }
};
</script>

<style>
body {
    text-transform: none;
}
.swiper-margin {
    margin: 2px;
}
.swiper-container {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: sans-serif;
}
.swiper-slide {
    width: 100%!important;
}
.swiper-slide:nth-child(2n), .swiper-slide:nth-child(4n) {
    width: 70%!important;
}
.swiper-slide:nth-child(3n), .swiper-slide:nth-child(5n) {
    width: 30%!important;
    overflow-y: scroll;
}
.fullheight, .v-window, .v-window__container {
    height: 100%;
}
.v-tabs__items {
    height: 100%;
}

.nav{
    position:fixed!important;
    top:3px!important;
}
.nav.prev {
    left: 3px!important;
}
.nav.next {
    right: 3px!important;
}
</style>
