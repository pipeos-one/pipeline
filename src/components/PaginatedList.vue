<template>
  <div class="paginatedlist">
   </br>
    <v-list two-line>
      <template v-for="(item, index) in items">
        <v-subheader
          :key="item._id"
        >
          <v-btn
            v-if="isRemix"
            v-on:click="$emit('load-remix', item)"
            small color="#EEEEEE"
          >To Remix</v-btn>
          <!-- <v-btn small color="#EEEEEE">abi</v-btn> -->
          <v-btn
            small
            color="warning"
            v-on:click="$emit('function-toggle', item)"
          >pipe</v-btn>
          {{ item.container ? item.container.name : '' }} - {{ item.abiObj ? item.abiObj.name : '' }}
        </v-subheader>

        <v-divider
          :inset="true"
          :key="index"
        ></v-divider>
      </template>
    </v-list>
    <div class="text-xs-center">
        <v-pagination
          :length="pages"
          :value="currentPage"
          v-on:input="changePage"
        ></v-pagination>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';

export default {
    props: ['items', 'pages', 'currentPage', 'isRemix'],
    created() {
        this.pages =  this.pages || 1;
    },
    methods: {
        isActive: function(page) {
            return page == this.currentPage;
        },
        changePage: function(page) {
            this.$emit('change-page', page);
        },
    }
};
</script>

<style>
h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.paginate-list {
  width: 90%;
  margin: 0 auto;
  text-align: left;
}

.paginate-list>li {
  display: block;
}

.paginate-list>li:before {
  content: '⚬ ';
  font-weight: bold;
  color: slategray;
}
</style>
