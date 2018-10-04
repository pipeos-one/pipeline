<template>
  <div class="forms">
      <ul id="example-1">
        <li v-for="item in items">
          <!--<router-link to={{ api + item._id }}>{{ api + item._id }}</router-link>-->
          <router-link v-bind:to="api + item._id">{{ item.name }}</router-link>
        </li>
      </ul>
  </div>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';

const get_api = Pipeos.pipeserver.ip + Pipeos.pipeserver.jsonapi;

export default {
  data() {
    return { api: '/forms/', items: [] };
  },
  created() {
    Vue.axios.get(get_api).then((response) => {
      console.log('response', response.data);
      this.items = response.data;
    });
  },
};
</script>
