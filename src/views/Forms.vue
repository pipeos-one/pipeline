<template>
    <v-content>
      <div class="forms">
          <ul id="example-1">
            <li v-for="item in items">
              <!--<router-link to={{ api + item._id }}>{{ api + item._id }}</router-link>-->
              <router-link v-bind:to="api + item._id">{{ item.name }}</router-link>
            </li>
          </ul>
      </div>
    </v-content>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';

export default {
  data() {
    return { api: '/forms/', items: [] };
  },
  created() {
    Vue.axios.get(Pipeos.pipeserver.api.json).then((response) => {
      console.log('response', response.data);
      this.items = response.data;
    });
  },
};
</script>
