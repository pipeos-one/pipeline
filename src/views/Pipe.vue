<template>
    <swiper ref="mySwiper" :options="swiperOptions">

                <swiper-slide>
                    <div class="pipe swiper-margin">
                        <Tags v-on:tag-toggle="onTagToggle"/>
                        <PipeFunctions
                            v-bind:tags="selectedTags"
                            v-on:function-toggle="onFunctionToggle"
                        />
                        </br>
                    </div>
                </swiper-slide>

                <swiper-slide>
                    <!-- <PipeTree :items="selectedFunctions"/> -->
                    <PipeCanvas :items="selectedFunctions"/>
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
import PipeFunctions from '../components/PipeFunctions';
import PipeTree from '../components/PipeTree';
import PipeCanvas from '../components/PipeCanvas';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/dist/css/swiper.css';

Vue.use(VueAwesomeSwiper);

const get_api = Pipeos.pipeserver.ip + Pipeos.pipeserver.jsonapi;

export default {
  components: {
    Tags,
    PipeFunctions,
    // PipeTree,
    PipeCanvas,
  },
  data() {
    return {
        selectedTags: [],
        selectedFunctions: [],
        swiperOptions: {},
    };
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
    }
  }
};
</script>

<style>
.swiper-margin {
    margin: 40px;
}
</style>
