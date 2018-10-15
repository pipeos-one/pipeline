<template>
  <div class="pipefunctions">
   </br>
    <v-list two-line>
      <template v-for="(item, index) in items">
        <v-subheader
          :key="item.abiObj.name"
        >
          <v-btn small color="#EEEEEE">abi</v-btn>
          <v-btn
            small
            color="warning"
            v-on:click="$emit('function-toggle', item)"
          >pipe</v-btn>
          ContainerName - {{ item.abiObj.name }}
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
import Pipeos from '../namespace/namespace';

const pipeserverApi = `${Pipeos.pipeserver.ip}/pipefunction`;
let filterOptions = {
    offset: 0,
    limit: 10,
    skip: 0,
};

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
        console.log('count', this.tags);
        const query = '?' + this.tags.map(tag => `where[tags][inq]=${tag}`).join('&');
        if (this.tags.length > 0) {
            query += '&where[tags][inq]=';
        }
        console.log('count', pipeserverApi + '/count' + query)
        Vue.axios.get(pipeserverApi + '/count' + query).then((response) => {
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
