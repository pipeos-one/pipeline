<template>
  <div class="tags">
      <div v-for="tag in tags">
        <button v-on:click="$emit('tag-toggle', tag.name)">{{ tag.name }}</button>
      </div>
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
