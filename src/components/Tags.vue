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

const pipeserverApi = `${Pipeos.pipeserver.ip}/tag`;

export default {
    data() {
        return {tags: []}
    },
    created() {
        Vue.axios.get(pipeserverApi).then((response) => {
          console.log('response', response.data);
          this.tags = response.data;
        });
    }
}
</script>
