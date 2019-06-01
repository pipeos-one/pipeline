<template>
    <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide class="swiper-margin no-swipe">
            <PipeAbout/>
        </swiper-slide>
        <swiper-slide class="swiper-margin no-swipe">
                <v-layout row wrap>
                    <v-flex xs4 style="margin-top: 50px;">
                        <Search
                            v-on:select="onSearchSelect"
                            v-on:search="onSearchQuery"
                            v-on:remove="onSearchRemove"
                        />
                        <LoadFromEthpm v-on:change="onLoadFromEthpm" style="margin-top: 5px;"/>
                        <RemixLoadContract style="margin-top: -19px;"
                            v-if="isRemix"
                            v-on:load-from-remix="loadFromRemixWrap"
                            v-on:provider-changed="setNetworkInfo"
                        />
                    </v-flex>
                    <v-flex xs8>
                    <PaginatedList
                        :items="selectedContainers"
                        :pages="pages"
                        :currentPage="currentPage"
                        :isRemix="isRemix"
                        v-bind:tags="selectedTags"
                        v-on:item-toggle="onTreeToggle"
                        v-on:subitem-toggle=""
                        v-on:change-page="changePageLoad"
                        v-on:load-remix="loadToRemix"
                    />
                    </v-flex>
                </v-layout>
        </swiper-slide class="swiper-margin">

        <swiper-slide class="swiper-margin no-swipe">
            <v-layout row wrap>
                <v-flex xs12>
                    <v-toolbar flat height="48" color="white">
                        <v-toolbar-items>
                            <v-tooltip bottom>
                                <v-btn
                                    flat round
                                    slot="activator"
                                    class="black--text normaltxt"
                                    :disabled="selectedTreeContainers.length === 0"
                                    @click="exportToEthpmUI"
                                >
                                    <v-icon left>fa-upload</v-icon>EthPM
                                </v-btn>
                                <span>Export tree loaded contracts</span>
                            </v-tooltip>
                            <v-dialog v-model="ethpmDialog" hide-overlay max-width="600px">
                                <v-card>
                                    <ExportToEthPM
                                        :result="exportToEthpmResult"
                                        :error="exportToEthpmError"
                                        v-on:export="exportToEthpm"
                                        v-on:retry="retryEthpmUpload"
                                    />
                                </v-card>
                            </v-dialog>
                        </v-toolbar-items>
                    </v-toolbar>
                </v-flex>
                <v-flex xs12>
                    <v-divider></v-divider>
                </v-flex>
            </v-layout>
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
                v-on:set-graphs="setCanvasGraph"
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
        <SimpleModal
            :modalIsActive="simpleModal.active"
            :modalMessage="simpleModal.msg"
            :hasChoice="simpleModal.choice"
            :modalInput="simpleModal.input"
            v-on:change="simpleModalChange"
        />
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
import LoadFromEthpm from '../components/LoadFromEthpm';
import Search from '../components/Search';
import ExportToEthPM from '../components/ExportToEthPM';
import SimpleModal from '../components/modals/SimpleModal';
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
const packageApi = Pipeos.pipeserver.api.package;

let filterOptions = {
    offset: 0,
    limit: 20,
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
    LoadFromEthpm,
    ExportToEthPM,
    SimpleModal,
  },
  data() {
    const data = {
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
        deploymentInfo: [],
        jsSource: '',
        graphSource: '',
        graphsAbi: null,
        graphInstance: null,
        pipedContracts: {},
        ethpmDialog: false,
        exportToEthpmResult: null,
        exportToEthpmError: null,
        simpleModalDefault: {
            active: false,
            msg: '',
            choice: false,
            input: {label: '', placeholder: '', value: ''},
            setBy: null,
        },
    };
    data.simpleModal = Object.assign({}, data.simpleModalDefault);
    data.modalQueue = [];
    return data;
  },
  mounted() {
    this.loadData();
    this.loadCanvas();
  },
  methods: {
    setNetworkInfo: function(chain, web3) {
        this.chain = chain;
        this.chain_query = chain === 'JavaScriptVM' ? '' : chain;
        this.web3 = web3;
        this.loadData();
        setTimeout(() => {
            if (this.chain === '1') {
                this.simpleModal.active = true;
                this.simpleModal.msg = 'Pipeline is Work In Progress. Do not deploy Pipeline created contracts on mainnet.';
                this.simpleModal.setBy = ['default'];
            }
        }, 3000);
    },
    buildContainersQuery(query = {}) {
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
    loadData: function(whereQuery = {}) {
        let query, containersQuery;
        this.countPClasses();

        let filter = this.filterOptions;
        filter.where = this.buildContainersQuery(whereQuery);
        filter = '?filter=' + JSON.stringify(filter);
        console.log('filter', filter);

        Vue.axios.get(containerFunctionsApi + filter).then((response) => {
            console.log('response', response);
            let pclasses = response.data.pclasses.map(pclass => {
                pclass.deployment = response.data.pclassii.find(depl => depl.pclassid == pclass._id);
                if (!pclass.deployment) {
                    pclass.deployment = {pclassi: {address: `Deployment address for ${pclass.name} not found.`}};
                }
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
                    let deployment_info;
                    this.contractSource = this.graphInstance.getSource('solidity');
                    this.graphSource = JSON.stringify(this.graphInstance.getSource('graphs'));
                    this.jsSource = this.graphInstance.getSource('javascript');
                    this.graphsAbi = this.graphInstance.getSource('abi');
                    deployment_info = this.graphInstance.getSource('constructor');
                    this.deploymentInfo = [{
                        funcName: 'proxy',
                        deployment: Pipeos.contracts.PipeProxy.addresses[this.chain],
                        contractName: 'PipeProxy',
                    }];

                    this.deploymentInfo = this.deploymentInfo.concat(
                        Object.keys(deployment_info).map(funcName => {
                            let function_id = deployment_info[funcName]
                            let contract_address;
                            this.selectedFunctions.forEach(pipedFunction => {
                                let functionObj = pipedFunction.find(func => func._id == function_id);
                                if (functionObj) {
                                    let deployment = functionObj.pclass.deployment.pclassi;
                                    contract_address = {
                                        funcName,
                                        deployment: deployment.openapiid ? `http://${deployment.host}${deployment.basePath}` : deployment.address,
                                        contractName: functionObj.pclass.name,
                                    };
                                }
                            });
                            return contract_address;
                        })
                    );
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
        this.changePage(1);
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
        this.changePage(1);
        if (searchQuery) {
            searchQuery = searchQuery.length > 3 ? searchQuery : null;
        }
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
    },
    changePageLoad: function(page) {
        this.changePage(page);
        this.loadData();
    },
    onFunctionToggle: function (pfunction) {
        if (pfunction.pfunction.gapi.type === 'event') {
            if (this.graphInstance.containsEvent(this.activeCanvas)) {
                this.simpleModal.active = true;
                this.simpleModal.msg = 'There can only be one event per graph/tab. You can add another graph/tab by clicking the + button.';
                this.simpleModal.setBy = ['default'];
                return;
            }
        }

        this.selectedFunctions[this.activeCanvas].push(pfunction);
        this.addToCanvas(pfunction, this.activeCanvas);
        console.log('activeCanvas', this.activeCanvas);
        console.log('this.selectedFunctions', this.selectedFunctions);
    },
    setCanvasGraph: function(graphs) {
        graphs.forEach((graph, i) => {
            Object.values(graph.n).forEach(node => {
                let pfunction;
                this.selectedTreeContainers.forEach(pclass => {
                    pfunction = pclass.functions.find(pfunc => pfunc._id === node.id);
                    if (pfunction) {
                        this.selectedFunctions[i].push(pfunction);
                        this.addToCanvas(pfunction, i);
                    }
                });
            });
        });
        this.graphInstance.setGraphs(graphs);
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
        this.modalQueue.push(Object.assign({}, this.simpleModalDefault, {
            msg: `Click "OK" if you want to load the "${name}" contract in Remix. You can change the name.`,
            choice: true,
            setBy: ['loadToRemixCall', source],
            input: {
                label: name,
                placeholder: name,
                value: name,
            },
        }));
        this.runModalQueue();
    },
    runModalQueue: function() {
        if (this.modalQueue[0] && !this.simpleModal.active) {
            this.simpleModal = this.modalQueue[0];
            this.simpleModal.active = true;
        }
    },
    shiftModalQueue: function() {
        this.modalQueue.shift();
        this.simpleModal = Object.assign({}, this.simpleModalDefault);
    },
    simpleModalChange: function(choice, inputValue) {
        if (this.simpleModal.setBy[0] === 'loadToRemixCall' && choice === true && inputValue) {
            let fileName = `browser/${inputValue}`;
            Pipeos.remixClient.call(
                'fileManager',
                'setFile',
                fileName,
                this.simpleModal.setBy[1],
            );
        }
        if (this.simpleModal.setBy[0] === 'loadFromRemixWrap') {
            if (choice === true) {
                this.saveFromRemix(...this.simpleModal.setBy[1]);
            } else {
                this.loadFromRemix(...this.simpleModal.setBy[1]);
            }
        }
        if (this.simpleModal.setBy[0] === 'pipedLoadToRemix'  && choice === true) {
            this.saveFromRemix(...this.simpleModal.setBy[1]);
        }
        this.shiftModalQueue();
        this.runModalQueue();
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
    onLoadFromEthpm: function(type, hash) {
        Vue.axios.get(`${packageApi}/storage/${type}/${hash}`).then((response) => {
            let ppackage = response.data;
            this.loadData({packageid: ppackage._id});
        }).catch(error => {
            this.simpleModal.active = true;
            this.simpleModal.msg = `Could not import package: ${error}`;
            this.simpleModal.setBy = ['default'];
        });
    },
    exportToEthpmUI: function() {
        this.exportToEthpmResult = null;
        this.exportToEthpmError = null;
        this.ethpmDialog = true;
    },
    exportToEthpm: function(ppackage) {
        if (!this.selectedTreeContainers.length) {
            this.simpleModal.active = true;
            this.simpleModal.msg = 'There are no contracts loaded in the right side tree';
            this.simpleModal.setBy = ['default'];
        }
        this.exportToEthpmResult = null;
        this.exportToEthpmError = null;
        ppackage.package.contracts = this.selectedTreeContainers.map((pclass) => pclass._id);
        Vue.axios.post(`${packageApi}/init`, ppackage).then((response) => {
            console.log('response', response);
            let ppackage = response.data;
            this.exportToEthpmResult = `Package was uploaded to swarm: ${JSON.stringify(ppackage.storage)}`;
        }).catch(error => {
            this.exportToEthpmError = `Could not export package: ${JSON.stringify(error)}`;
        });
    },
    retryEthpmUpload: function() {
        Vue.axios.get(`${containerApi}/${this.selectedTreeContainers[0]._id}`)
        .then((response) => {
            return response.data;
        }).then((pclass) => {
            if (!pclass || !pclass.packageid) {
                throw new Error(`No package id found`);
            }
            return Vue.axios.get(`${packageApi}/export/${pclass.packageid}`);
        }).then((response) => {
            this.exportToEthpmResult = `Package was uploaded to swarm: ${JSON.stringify(response.data.storage)}`;
            this.exportToEthpmError = null;
        }).catch(error => {
            this.exportToEthpmError = `Could not export package: ${JSON.stringify(error)}`;
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
            this.simpleModal.active = true;
            this.simpleModal.msg = `${message} The contract will only load in the plugin client and will disappear on Refresh.`;
            this.simpleModal.setBy = ['default'];

            this.loadFromRemix(compiled_contract, deployment_info);
        } else {
            this.simpleModal.active = true;
            this.simpleModal.msg = `
                ${message}
                Click "OK" if you want to save it on the Pipeos server.
                Click "Cancel" and the contract will only load in the plugin client and will disappear on Refresh.`;
            this.simpleModal.choice = true;
            this.simpleModal.setBy = ['loadFromRemixWrap', [compiled_contract, deployment_info]];
        }
    },
    pipedLoadToRemix: function() {
        let self = this;
        let name = `PipedContract_${randomId()}.sol`;
        this.loadToRemixCall(name, this.contractSource);
        this.pipedContracts[name] = null;

        if (this.chain === 'JavaScriptVM') return;

        Pipeos.remixClient.on('udapp', 'newTransaction', async (data) => {
            console.log('pipedLoadToRemix newTransaction', data);
            const result = await Pipeos.remixClient.call(
                'solidity',
                'getCompilationResult'
            );
            console.log(error, result);
            if (error) {
                throw new Error(error);
            }
            if (!result[0].source.target) return;
            compiledContractProcess(result[0]).forEach((contract) => {
                contract.tags.push('piped');
                console.log('contract', contract);
                if (this.pipedContracts[contract.name]) {
                    this.simpleModal.active = true;
                    this.simpleModal.msg = `
                        You have deployed ${contract.name}.
                        Click "OK" if you want to save it on the Pipeos server.`;
                    this.simpleModal.choice = true;
                    this.simpleModal.setBy = [
                        'pipedLoadToRemix',
                        [contract, {
                            deployed: {
                                address: data[0].contractAddress,
                                chain_id: this.chain,
                            }
                        }]
                    ];
                }
            });
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
}
.swiper-slide {
    width: 100%!important;
}
.swiper-slide:nth-child(2n), .swiper-slide:nth-child(4n) {
    width: 60%!important;
}
.swiper-slide:nth-child(3n), .swiper-slide:nth-child(5n) {
    width: 40%!important;
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

.v-input__icon .v-icon {
    font-size: 16px;
}
.v-text-field {
    padding: 0;
}
.v-select__selections, .v-input__slot {
    font-size: 12px;
}
.wraptxt {
    word-break: break-all;
    white-space: normal;
}
.v-expansion-panel__header {
    padding-left: 0;
    min-height: 35px;
}
.v-list__tile {
    height: 30px !important;
}
.v-list__tile__title {
    padding-left: 30px;
    font-size: 12px;
}
</style>
