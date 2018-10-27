<template>
    <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide class="swiper-margin no-swipe">
            <RemixLoadContract v-on:load-from-remix="loadFromRemixWrap"/>
                <!-- <Tags v-on:tag-toggle="onTagToggle"/> -->
                <v-flex xs11>
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
                    ><v-icon>add</v-icon></v-btn>
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
                v-on:contract-deploy="deployPipeContract"
            />
        </swiper-slide>

        <v-btn absolute small top left fab
            color="white"
            slot="button-prev"
            class="nav prev"
        >
            <v-icon>chevron_left</v-icon>
        </v-btn>
        <v-btn absolute small top right fab
            color="white"
            class="nav next"
            slot="button-next"
        >
            <v-icon>chevron_right</v-icon>
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
import RemixLoadContract from '../components/remix/RemixLoadContract';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';
import {randomId} from '../utils/utils';
import loadAll from '../components/pipecanvas/pipecanvaslib.js';

Vue.use(VueAwesomeSwiper);

const get_api = Pipeos.pipeserver.api.json;
const functionsAPI = Pipeos.pipeserver.api.function;
const containerApi = Pipeos.pipeserver.api.container;
const containerFunctionsApi = Pipeos.pipeserver.api.container + '/pipefunctions';
let filterOptions = {
    offset: 0,
    limit: 10,
    skip: 0,
};

const graph = {"n": [], "e": []};

export default {
  components: {
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
        selectedTags: [],
        pages: 1,
        currentPage: 1,
        taggedFunctions: [],
        selectedTreeContainers: [],
        selectedFunctions: [[]],
        activeCanvas: 0,
        canvases: 1,
        graphs: [Object.assign({}, graph)],
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
        contractSource: 'contract Test {}',
    };
  },
  mounted() {
    this.loadData();
    this.loadCanvas();
  },
  methods: {
    loadData: function() {
        this.setPipeContainers();
        this.countPipeFunctions();
        this.setPipeFunctions();
    },
    loadCanvas: function() {
        this.graphs[this.activeCanvas].n = this.selectedFunctions[
            this.activeCanvas
        ].map((item, index) => {
            return {
                i: index,
                id: item._id,
            }
        });

        if (this.selectedFunctions[this.activeCanvas].length > 0) {
            loadAll(
                Array.apply(null, {length: this.canvases})
                    .map(Function.call, Number)
                    .map(canvasIndex => `draw_${canvasIndex + 1}`),
                this.selectedFunctions,
                this.graphs,
            );
        }
    },
    addToCanvas: function(pipefunction, index) {
        this.loadCanvas();
    },
    onTagToggle: function (tagName) {
      if (tagName === 'all') {
        this.selectedTags = [];
      } else {
          this.selectedTags = [tagName];
      }
      console.log('this.selectedTags', this.selectedTags);
      this.loadData();
    },
    changePage: function(page) {
        this.filterOptions.skip = this.filterOptions.limit * (page - 1);
        const newPage = this.filterOptions.skip / this.filterOptions.limit + 1;
        if (0 < newPage <= this.pages) {
            this.currentPage = newPage;
        }
        this.setPipeFunctions();
        // this.setPipeContainers();
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
    countPipeFunctions: function() {
        console.log('count', this.selectedTags);
        let query = '?' + this.selectedTags.map(tag => `where[tags][inq]=${tag}`).join('&');
        if (this.selectedTags.length > 0) {
            query += '&where[tags][inq]=';
        }
        console.log('count', functionsAPI + '/count' + query)
        Vue.axios.get(functionsAPI + '/count' + query).then((response) => {
          this.pages = Math.ceil(response.data.count / filterOptions.limit);
        });
    },
    setPipeFunctions: function() {
        let query = '?' + Object.keys(this.filterOptions)
            .map(key => `filter[${key}]=${this.filterOptions[key]}`)
            .concat(
                this.selectedTags.map(tag => `filter[where][tags][inq]=${tag}`)
            )
            .join('&');
        if (this.selectedTags.length > 0) {
            query += '&filter[where][tags][inq]=';
        }

        Vue.axios.get(functionsAPI + query).then((response) => {
          this.linkContainersFunctions(response.data);
        });
    },
    setPipeContainers: function() {
        let query = '?' + Object.keys(this.filterOptions).map(
            key => `filter[${key}]=${this.filterOptions[key]}`
        ).concat(
            this.selectedTags.map(tag => `filter[where][tags][inq]=${tag}`)
        ).join('&');

        if (this.selectedTags.length > 0) {
            query += '&filter[where][tags][inq]=';
        }

        Vue.axios.get(containerApi + query).then((response) => {
            this.selectedContainers = response.data;
            this.linkContainersFunctions(this.taggedFunctions);
        });
    },
    linkContainersFunctions: function(pipeFunctions) {
        this.taggedFunctions = pipeFunctions.map(func => {
            func.container = Object.assign({}, this.selectedContainers.find(cont => cont._id === func.containerid));
            return func;
        });
    },
    setActiveCanvas: function(value) {
        console.log('setActiveCanvas', value);
        this.activeCanvas = value;
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
        Vue.axios.post(containerFunctionsApi, container)
        .then((response) => {
            console.log('post', response);
            this.loadData();
        }).catch(function (error) {
            console.log(error);
        });
        // TODO post deployment
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
    deployPipeContract: function() {
        console.log('Deploy source code');
        if (this.isRemix) {
            this.loadRemixCall('PipelineContract', 'somesoource');
        }
    }
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
    width: 66%!important;
}
.swiper-slide:nth-child(2n), .swiper-slide:nth-child(4n) {
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
