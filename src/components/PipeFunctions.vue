<template>
  <div class="pipefunctions">
   </br>
    <ul class="paginate-list">
      <li v-for="item in items">
        {{ item.abiObj }}
      </li>
    </ul>
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
import Pipeos from '../namespace/namespace';

const pipeserverApi = `${Pipeos.pipeserver.ip}/pipefunction`;
let filterOptions = {
    offset: 0,
    limit: 10,
    skip: 0,
};
let filterWhere = {};

// filter[offset]=0&filter[limit]=10&filter[skip]=0&filter[where][tags][%in]=[%22market%22]

export default {
  props: ['tags'],
  data() {
    return {items: [], pages: 1, currentPage: 1, filterOptions};
  },
  created() {
    this.countPipeFunctions();
    this.getPipeFunctions();
  },
  watch: {
    tags: function(newValue, oldValue) {
        this.getPipeFunctions();
    }
  },
  methods: {
    isActive: function(page) {
        return page == this.currentPage;
    },
    changePage: function(page) {
        this.filterOptions.skip = this.filterOptions.limit * (page - 1);
        this.setCurrentPage();
    },
    setCurrentPage: function() {
        const newPage = this.filterOptions.skip / this.filterOptions.limit + 1;
        if (0 < newPage <= this.pages) {
            this.currentPage = newPage;
            this.getPipeFunctions();
        }
    },
    countPipeFunctions: function() {
        Vue.axios.get(pipeserverApi + '/count').then((response) => {
          this.pages = Math.ceil(response.data.count / filterOptions.limit);
        });
    },
    getPipeFunctions: function() {
        let query = '?' + Object.keys(this.filterOptions)
            .map(key => `filter[${key}]=${this.filterOptions[key]}`)
            .concat(
                this.tags.map(tag => `filter[where][tags][inq]=${tag}`)
            )
            .join('&');
        if (this.tags.length > 0) {
            query += '&filter[where][tags][inq]=';
        }

        Vue.axios.get(pipeserverApi + query).then((response) => {
          this.items = response.data;
        });
    }
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
