<template>
  <div class="tags">
      <v-select
          :items="tags"
          item-text="name"
          item-value="name"
          v-model="e7"
          label="Tags"
          multiple
          chips
          persistent-hint
          deletable-chips
          v-on:change="tagsChanged"
        ></v-select>
  </div>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';

export default {
    data() {
        return {tags: [], e7: []}
    },
    created() {
        Vue.axios.get(Pipeos.pipeserver.api.tag).then((response) => {
          console.log('response', response.data);
          this.tags = response.data;
        });
    },
    methods: {
        tagsChanged: function(selectedTags) {
            this.$emit('tag-toggle', selectedTags)
        }
    }
}
</script>

<style>
.tags {
    margin-top: 45px;
}
</style>
