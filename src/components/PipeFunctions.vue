<template>
  <div class="pipefunctions">
   </br>
    <ul class="paginate-list">
      <li v-for="item in items">
        {{ item.abiObj }}
      </li>
    </ul>

    <Pagination
        :pages="pages"
        :currentPage="currentPage"
        v-on:change-page="changePage"
        v-on:next-page="nextPage"
        v-on:prev-page="prevPage"
    />
  </div>
</template>
<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';
import Pagination from './Pagination';

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
  components: {
    Pagination,
  },
  data() {
    return {items: [], pages: [1], currentPage: 1, filterOptions};
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
    nextPage: function() {
        const skip = this.filterOptions.skip + this.filterOptions.limit;
        if (this.getCurrentPage(skip)) {
            this.filterOptions.skip = skip;
            this.setCurrentPage();
        }
    },
    prevPage: function() {
        const skip = this.filterOptions.skip - this.filterOptions.limit;
        if (this.getCurrentPage(skip)) {
            this.filterOptions.skip = skip;
            this.setCurrentPage();
        }
    },
    setCurrentPage: function() {
        this.currentPage = this.getCurrentPage() || 1;
        this.getPipeFunctions();
    },
    getCurrentPage: function(skip=null, limit=null) {
        const newPage = (skip || this.filterOptions.skip) / (limit || this.filterOptions.limit) + 1;
        if (this.pages.find(page => page == newPage)) {
            return newPage;
        }
        else {
            return 0;
        }
    },
    countPipeFunctions: function() {
        Vue.axios.get(pipeserverApi + '/count').then((response) => {
          let count = Math.ceil(response.data.count / filterOptions.limit);
          this.pages = [...Array(count + 1).keys()];
          this.pages.shift();
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

.paginate-links.items {
  user-select: none;
}

.paginate-links.items>li.active a {
  font-weight: bold;
}
.paginate-links.items>li.next:before {
  content: ' | ';
  margin-right: 13px;
  color: #ddd;
}
.paginate-links.items>li.disabled a {
  color: #ccc;
  cursor: no-drop;
}

a {
  color: #42b983;
  cursor: pointer;
}
</style>
