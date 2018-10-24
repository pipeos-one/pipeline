<template>
  <div class="tags">
      <v-btn
        small
        color="#EEEEEE"
        v-for="tag in tags"
        v-on:click="$emit('tag-toggle', tag.name)"
      >{{ tag.name }}
      </v-btn>
  </div>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';

export default {
    data() {
        return {tags: []}
    },
    created() {
        Vue.axios.get(Pipeos.pipeserver.api.tag).then((response) => {
          console.log('response', response.data);
          this.tags = [{name: 'all'}].concat(response.data);
        });
    }
}
</script>
