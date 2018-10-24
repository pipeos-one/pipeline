<template>
    <swiper ref="mySwiper" :options="swiperOptions">

                <swiper-slide>
                    <v-btn
                      v-if="isRemix"
                      v-on:click="saveFromRemix"
                      small color="warning"
                    >Save from Remix</v-btn>
                    <v-btn
                      v-if="isRemix"
                      v-on:click="loadFromRemix"
                      small color="warning"
                    >Load from Remix</v-btn>
                    <!-- <v-btn
                      v-if="isRemix"
                      v-on:click="loadAllFromRemix"
                      small color="warning"
                    >Load all from Remix</v-btn> -->
                    <div class="pipe swiper-margin">
                        <Tags v-on:tag-toggle="onTagToggle"/>
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
                        </br>
                    </div>
                </swiper-slide>

                <swiper-slide>
                    <PipeTree :items="selectedTreeContainers" v-on:item-toggle="onFunctionToggle"/>
                </swiper-slide>

                <swiper-slide class="canvas-slide  no-swipe">
                    <PipeCanvas :items="selectedFunctions" :containers="selectedContainers"/>
                </swiper-slide>

                <swiper-slide>I'm Slide 3</swiper-slide>

                <swiper-slide>I'm Slide 4</swiper-slide>

                <swiper-slide>I'm Slide 5</swiper-slide>

                <swiper-slide>I'm Slide 6</swiper-slide>

                <swiper-slide>I'm Slide 7</swiper-slide>

        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';
import Tags from '../components/Tags';
import PaginatedList from '../components/PaginatedList';
import PipeTree from '../components/PipeTree';
import PipeCanvas from '../components/pipecanvas/PipeCanvas';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

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

export default {
  components: {
    Tags,
    PaginatedList,
    PipeTree,
    PipeCanvas,
  },
  data() {
    return {
        isRemix: window.self !== window.top,
        selectedTags: [],
        pages: 1,
        currentPage: 1,
        taggedFunctions: [],
        selectedTreeContainers: [],
        selectedFunctions: [],
        swiperOptions: {noSwiping: true,
        noSwipingClass: "no-swipe"},
        selectedContainers: [],
        filterOptions,
        pipeJs: {},
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData: function() {
        this.setPipeContainers();
        this.countPipeFunctions();
        this.setPipeFunctions();
    },
    onTagToggle: function (tagName) {
      console.log('onTagToggle', tagName);
      // let index = this.selectedTags.findIndex(tag => tag == tagName);
      // if (index > -1) {
      //   this.selectedTags.splice(index, 1);
      // }
      // else {
      //   this.selectedTags.push(tagName);
      // }
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
    },
    onFunctionToggle: function (pipefunction) {
        let index = this.selectedFunctions.findIndex(func => func._id == pipefunction._id);
        if (index > -1) {
          this.selectedFunctions.splice(index, 1);
        }
        else {
          this.selectedFunctions.push(pipefunction);
        }
        console.log('this.selectedFunctions', this.selectedFunctions);
    },
    onTreeFunctionToggle: function (pipefunction) {
        let index = this.selectedTreeContainers.findIndex(container => container._id == pipefunction.container._id);
        if (index < 0) {
          this.selectedTreeContainers.push(this.selectedContainers.find(container => container._id == pipefunction.container._id));
        }
        this.loadPipeJs(pipefunction);
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
          this.taggedFunctions = response.data;
          this.linkContainersFunctions();
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
            this.linkContainersFunctions();
            console.log('sselectedContainers', this.selectedContainers);
        });
    },
    linkContainersFunctions: function() {
        this.taggedFunctions = this.taggedFunctions.map(func => {
            let index = this.selectedContainers.findIndex(cont => cont._id === func.containerid);
            if (index >= 0) {
                func.container = this.selectedContainers[index];
                if (!this.selectedContainers[index].functions) {
                    this.selectedContainers[index].functions = [];
                }
                this.selectedContainers[index].functions.push(func);
            }
            return func;
        });
    },
    loadRemix: function(item) {
        console.log([`browser/Pipeos_${item.container.name}.sol`, item.container.solsource])

        Pipeos.remix.call(
            'editor',
            'setFile',
            [`browser/Pipeos_${item.container.name}.sol`, item.container.solsource],
            function (error, result) { console.log(error, result) }
        );
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
                callback(result);
            }
        );
    },
    loadFromRemix: function() {
        this.getDataFromRemix(result => {
            console.log('loadFromRemix', result)
        });
    },
    saveFromRemix: function() {
        console.log('saveFromRemix')
        this.getDataFromRemix(result => {
            console.log('saveFromRemix', result)
            let compiled = result[0];
            const target = compiled.source.target;
            let additional_solsources;
            if (Object.keys(compiled.source.sources).length > 1) {
                additional_solsources = Object.assign({}, compiled.source.sources);
                delete additional_solsources[target];
            }
            Object.entries(compiled.data.contracts[target]).forEach(entry => {
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
                        additional_solsources,
                        bytecode: contract.evm.bytecode,
                        deployedBytecode: contract.evm.deployedBytecode,
                        metadata: contract.metadata,
                    },
                    tags: [],
                };

                // Remove duplicate abi, devdoc, userdoc
                delete data.container.metadata.output;
                console.log('data', data);
                Vue.axios.post(containerFunctionsApi, data)
                .then((response) => {
                    console.log('post', response);
                    this.loadData();
                }).catch(function (error) {
                    console.log(error);
                });
            });
        });
    }
  }
};
</script>

<style>
.swiper-margin {
    margin: 40px;
}
.swiper-slide {
    width: 75%;
}
.swiper-slide:nth-child(2n), .swiper-slide:nth-child(4n) {
    width: 25%;
    overflow-y: scroll;
}
</style>
