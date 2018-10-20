<template>
    <swiper ref="mySwiper" :options="swiperOptions">

                <swiper-slide>
                    <div class="pipe swiper-margin">
                        <Tags v-on:tag-toggle="onTagToggle"/>
                        <PaginatedList
                            :items="taggedFunctions"
                            :pages="pages"
                            :currentPage="currentPage"
                            v-bind:tags="selectedTags"
                            v-on:function-toggle="onFunctionToggle"
                            v-on:change-page="changePage"
                        />
                        </br>
                    </div>
                </swiper-slide>

                <swiper-slide>
                    <PipeTree :items="selectedFunctions"/>
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

const get_api = Pipeos.pipeserver.ip + Pipeos.pipeserver.jsonapi;
const functionsAPI = `${Pipeos.pipeserver.ip}/pipefunction`;

const containerApi = `${Pipeos.pipeserver.ip}/pipecontainer`;
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
        selectedTags: [],
        pages: 1,
        currentPage: 1,
        taggedFunctions: [],
        selectedFunctions: [],
        swiperOptions: {noSwiping: true,
        noSwipingClass: "no-swipe"},
        selectedContainers: [],
        filterOptions,
        pipeJs: {},
    };
  },
  mounted() {
    this.setPipeFunctions();
    this.countPipeFunctions();
    this.setPipeContainers();
  },
  methods: {
    onTagToggle: function (tagName) {
      console.log('onTagToggle', tagName);
      let index = this.selectedTags.findIndex(tag => tag == tagName);
      if (index > -1) {
        this.selectedTags.splice(index, 1);
      }
      else {
        this.selectedTags.push(tagName);
      }
      console.log('this.selectedTags', this.selectedTags);
      this.setPipeContainers();
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
        const query = '?' + this.selectedTags.map(tag => `where[tags][inq]=${tag}`).join('&');
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
          console.log('sselectedContainers', this.selectedContainers);
        });
    },
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
