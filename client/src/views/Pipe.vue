<template>
    <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide class="swiper-margin no-swipe">
            <PipeAbout/>
        </swiper-slide>
        <swiper-slide class="swiper-margin no-swipe">
                <v-layout row wrap>
                    <v-flex xs3 style="margin-top: 70px;">
                        <Search
                            v-on:select="onSearchSelect"
                            v-on:search="onSearchQuery"
                            v-on:remove="onSearchRemove"
                        />
                        <RemixLoadContract
                            v-on:load-from-remix="loadFromRemixWrap"
                            v-on:provider-changed="setNetworkInfo"
                        />
                    </v-flex>
                    <v-flex xs9>
                    <PaginatedList
                        :items="selectedContainers"
                        :pages="pages"
                        :currentPage="currentPage"
                        :isRemix="isRemix"
                        v-bind:tags="selectedTags"
                        v-on:item-toggle="onTreeToggle"
                        v-on:subitem-toggle=""
                        v-on:change-page="changePage"
                        v-on:load-remix="loadToRemix"
                    />
                    </v-flex>
                </v-layout>
        </swiper-slide class="swiper-margin">

        <swiper-slide class="swiper-margin no-swipe">
            <PipeTree
                :items="selectedTreeContainers"
                :removeItem="1"
                v-on:subitem-toggle="onFunctionToggle"
                v-on:remove-item="removeTreeItem"
            />
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
                :jsSource="jsSource"
                :graphSource="graphSource"
                :graphsAbi="graphsAbi"
                v-on:load-remix="pipedLoadToRemix"
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
import PaginatedList from '../components/PaginatedList';
import PipeTree from '../components/PipeTree';
import PipeCanvas from '../components/pipecanvas/PipeCanvas';
import PipeApp from '../components/pipeapp/PipeApp';
import PipeAbout from '../components/about/PipeAbout';
import RemixLoadContract from '../components/remix/RemixLoadContract';
import Search from '../components/Search';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import {
    randomId,
    pfunctionColorClass,
    compiledContractProcess,
} from '../utils/utils';
import Graphs from '../components/pipecanvas/pipecanvaslib.js';

Vue.use(VueAwesomeSwiper);

const get_api = Pipeos.pipeserver.api.json;
const functionsApi = Pipeos.pipeserver.api.pfunction;
const containerApi = Pipeos.pipeserver.api.pclass;
const containerFunctionsApi = Pipeos.pipeserver.api.pclass + '/pfunctions';
const containerDeployedApi = Pipeos.pipeserver.api.pclass + '/pclassi';
const deployedApi = Pipeos.pipeserver.api.pclassi;

let filterOptions = {
    offset: 0,
    limit: 7,
    skip: 0,
};

export default {
  components: {
    PipeAbout,
    Search,
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
        selectedProjects: [],
        searchQuery: null,
        pages: 1,
        currentPage: 1,
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
        jsSource: '',
        graphSource: '',
        graphsAbi: null,
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
        this.chain_query = chain === 'JavaScriptVM' ? '3' : chain;
        this.web3 = web3;
        this.loadData();
        setTimeout(() => {
            if (this.chain === '1') {
                alert('Pipeline is Work In Progress. Do not deploy Pipeline created contracts on mainnet.');
            }
        }, 3000);
    },
    buildContainersQuery() {
        let query = {};
        if (this.selectedTags.length > 0) {
            query.tags = {inq: this.selectedTags};
        }
        if (this.chain_query) {
            query.chainids = {inq: [this.chain_query]};
        }
        if (this.selectedProjects.length > 0) {
            query.or = this.selectedProjects.map((project) => {
                    return {project: {like: project, options: 'i'}}
            });
        }
        if (this.searchQuery) {
            query.name = {like: this.searchQuery, options: 'i'};
        }

        return query;
    },
    loadData: function() {
        let query, containersQuery;
        this.countPClasses();

        let filter = this.filterOptions;
        filter.where = this.buildContainersQuery();
        filter = '?filter=' + JSON.stringify(filter);
        console.log('filter', filter);

        Vue.axios.get(containerFunctionsApi + filter).then((response) => {
            console.log('response', response);
            let pclasses = response.data.pclasses.map(pclass => {
                pclass.deployment = response.data.pclassii.find(depl => depl.pclassid == pclass._id);
                return pclass;
            });
            this.linkContainersFunctions(response.data.pfunctions, pclasses);
        });
    },
    countPClasses: function() {
        let where = this.buildContainersQuery();
        where = '?where=' + JSON.stringify(where);

        console.log('where', where)
        Vue.axios.get(containerApi + '/count' + where).then((response) => {
            this.pages = Math.ceil(response.data.count / filterOptions.limit);
            console.log('countPFunctions', response.data, this.pages, filterOptions);
        });
    },
    loadCanvas: function() {
        this.graphInstance = new Graphs(
            this.selectedFunctions,
            {
                onGraphChange: () => {
                    this.contractSource = this.graphInstance.getSource('solidity');
                    this.graphSource = JSON.stringify(this.graphInstance.getSource('graphs'));
                    this.jsSource = this.graphInstance.getSource('javascript');
                    this.graphsAbi = this.graphInstance.getSource('abi');
                    this.deploymentInfo = [Pipeos.contracts.PipeProxy.addresses[this.chain]]
                        .concat(this.graphInstance.getSource('constructor').map(function_id => {
                            let contract_address;
                            this.selectedFunctions.forEach(pipedFunction => {
                                let functionObj = pipedFunction.find(func => func._id == function_id);
                                if (functionObj) {
                                    contract_address = functionObj.pclass.deployment.pclassi.address;
                                }
                            });
                            return contract_address;
                        })).map(address => `"${address}"`).join(',');
                    console.log('this.deploymentInfo', this.deploymentInfo);
                },
                onGraphFunctionRemove: (grIndex, nodes) => {
                    console.log('onGraphFunctionRemove', grIndex, nodes);
                    // nodes.map(node => {
                    //     console.log('node', node, this.selectedFunctions[grIndex][node.i]._id);
                    //     if (this.selectedFunctions[grIndex][node.i]._id === node.id) {
                    //         this.selectedFunctions[grIndex][node.i].removed = true;
                    //         console.log('removed');
                    //     }
                    // });
                },
            }
        );
        this.graphInstance.addGraph(`draw_${this.activeCanvas + 1}`);
    },
    addToCanvas: function(pfunction, index) {
        this.graphInstance.addFunction(pfunction, index);
    },
    onSearchSelect: function (searchSelected) {
        let tags = [], projects = [];
        searchSelected.forEach((selected) => {
            if (selected.tag) tags.push(selected.name);
            if (selected.project) projects.push(selected.name);
        });
        this.selectedTags = tags;
        this.selectedProjects = projects;
        this.loadData();
    },
    onSearchQuery: function(searchQuery) {
        searchQuery = searchQuery.length > 3 ? searchQuery : null;
        if (!this.searchQuery && !searchQuery) return;
        this.searchQuery = searchQuery;
        this.loadData();
    },
    onSearchRemove: function(searchRemove) {
        this.searchQuery = null;
        if (searchRemove.tag) {
            this.selectedTags.splice(
                this.selectedTags.findIndex((name) => {
                    name === searchRemove.name
                }),
                1
            );
        } else if (searchRemove.project) {
            this.selectedProjects.splice(
                this.selectedProjects.findIndex((name) => {
                    name === searchRemove.name
                }),
                1
            );
        }
    },
    changePage: function(page) {
        this.filterOptions.skip = this.filterOptions.limit * (page - 1);
        const newPage = this.filterOptions.skip / this.filterOptions.limit + 1;
        if (0 < newPage <= this.pages) {
            this.currentPage = newPage;
        }
        this.loadData();
    },
    onFunctionToggle: function (pfunction) {
        if (pfunction.pfunction.gapi.type === 'event') {
            if (this.graphInstance.containsEvent(this.activeCanvas)) {
                alert('There can only be one event per graph/tab. You can add another graph/tab by clicking the + button.');
                return;
            }
        }

        this.selectedFunctions[this.activeCanvas].push(pfunction);
        this.addToCanvas(pfunction, this.activeCanvas);
        console.log('activeCanvas', this.activeCanvas);
        console.log('this.selectedFunctions', this.selectedFunctions);
    },
    onTreeToggle: function (pclass) {
        let index = this.selectedTreeContainers.findIndex(container => container._id == pclass._id);
        if (index < 0) {
            this.selectedTreeContainers.push(pclass);
        }
        // this.loadPipeJs(pfunction);
    },
    removeTreeItem: function(pclass) {
        let index = this.selectedTreeContainers.findIndex(container => container._id == pclass._id);
        if (index >= 0) {
            this.selectedTreeContainers.splice(index, 1);
        }
    },
    loadPipeJs: function(pfunction) {
        const pclassid = pfunction.pclassid;
        const script_api = `${containerApi}/${pclassid}/js`;
        let script = document.createElement('script')
        script.src = script_api;
        script.async = true
        script.onload = () => {
            this.pipeJs[`${pclassid}_${pfunction.name}`] = window[pfunction.name];
        }
        document.head.appendChild(script);
    },
    linkContainersFunctions: function(pfunctions, pclasses) {
        pfunctions = pfunctions.map(func => {
            func.pclass = Object.assign({}, pclasses.find(cont => cont._id === func.pclassid));
            func.styleClasses = pfunctionColorClass(func.pfunction.gapi);
            return func;
        });
        this.selectedContainers = pclasses.map(container => {
            container.functions = pfunctions.filter(func => func.pclassid == container._id);
            return container;
        });
        console.log('this.selectedContainers', this.selectedContainers);
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
    loadToRemix: function(item) {
        item.pclass.sources.map((source, i) => {
            let fileName;
            if (source.relative_path) {
                fileName = source.relative_path.substring(
                    source.relative_path.lastIndexOf('/') + 1
                );
            }
            fileName = fileName || `${item.name}_${i}.sol`;
            this.loadToRemixCall(fileName, source.source);
        });
    },
    loadToRemixCall: function(name, source) {
        let fileName = `browser/${name}`;
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
        container.tags.push('uncurated');

        Vue.axios.get(
            `${containerApi}?filter[where][pclass.runtime_bytecode.bytecode]=${container.pclass.runtime_bytecode.bytecode}`
        ).then((response) => {
            let existant = response.data[0];
            let chainid = deployment.pclassi.chain_id;

            // Insert new container only if there is no other container with the same bytecode
            if (!existant) {
                console.info('Inserting new container and functions');
                container.chainids = [chainid];
                return Vue.axios.post(containerFunctionsApi, container);
            }

            response.data = existant
            return response;
        }).then((response) => {
            console.log('posted container', response);
            // Connect deployed instance with container
            deployment.pclassid = response.data._id;
            return Vue.axios.post(containerDeployedApi, deployment);
        }).then((response) => {
            console.log('posted deployment', response);
            // Reload data after insert, to include information in the paginated list
            this.loadData();
        }).catch(function (error) {
            console.log(error);
        });
    },
    buildFunctionsFromContainer: function(container) {
        let abi = container.pclass.gapi;
        let natspec = container.pclass.natspec;
        let functions = [];

        abi.forEach(funcabi => {
            let signature;

            if (funcabi.name) {
                signature = `${funcabi.name}(${funcabi.inputs.map(input => input.type).join(',')})`;

                functions.push({
                    _id: randomId(),
                    styleClasses: pfunctionColorClass(funcabi),
                    pclassid: container._id,
                    pclass: Object.assign({}, container),
                    pfunction: {
                        signature,
                        gapi: funcabi,
                        natspec: natspec.methods[signature],
                    },
                });
            }
        });
        return functions;
    },
    loadFromRemixWrap: function(compiled_contract, deployment_info) {
        let message = `
            Loading ${compiled_contract.name} (deployed at ${deployment_info.pclassi.address} on chain ${deployment_info.pclassi.chain_id}) to Pipeline.
        `;
        if (deployment_info.pclassi.chain_id === 'JavaScriptVM') {
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
    pipedLoadToRemix: function() {
        let self = this;
        let name = `PipedContract_${randomId()}.sol`;
        this.loadToRemixCall(name, this.contractSource);
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
                        contract.tags.push('piped');
                        console.log('contract', contract);
                        if (self.pipedContracts[contract.name]) {
                            if (confirm(`
                                You have deployed ${contract.name}.
                                Click "OK" if you want to save it on the Pipeos server.`)
                            ) {
                                self.saveFromRemix(contract, {
                                    deployed: {
                                        address: data[0].contractAddress,
                                        chain_id: this.chain,
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
