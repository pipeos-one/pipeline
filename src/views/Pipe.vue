<template>
  <div class="pipe">
      <Tags v-on:tag-toggle="onTagToggle"/>
      <PipeFunctions v-bind:tags="selectedTags"/>
      </br>
  </div>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';
import Tags from '../components/Tags';
import PipeFunctions from '../components/PipeFunctions';

const get_api = Pipeos.pipeserver.ip + Pipeos.pipeserver.jsonapi;

export default {
  components: {
    Tags,
    PipeFunctions,
  },
  data() {
    return { selectedTags: [] };
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
    }
  }
};
</script>
