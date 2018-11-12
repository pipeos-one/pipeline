<template>
  <div class="paginatedlist">
      <div class="text-xs-center">
          <v-pagination
            :length="pages"
            :value="currentPage"
            total-visible="7"
            v-on:input="changePage"
          ></v-pagination>
      </div>
    <div v-if="items.length === 0">
        <p>Pipeline database does not contain contracts deployed on this chain.
        To see & play with Pipeline stored contracts, please change to Ropsten, Rinkeby or Kovan.</p>
        <p>Otherwise, please import your own deployed contracts from Remix.</p>
    </div>
    <v-list two-line v-if="items.length > 0">
      <template v-for="(item, index) in items">
        <v-subheader
          :key="item._id"
          v-if="item.abiObj.name"
          v-bind:class="[item.styleClasses]"
        >
          <v-tooltip top>
              <v-btn
                v-if="isRemix"
                v-on:click="$emit('load-remix', item)"
                flat icon
                slot="activator"
              ><v-icon light small>fa-upload</v-icon></v-btn>
          <span>Load contract to Remix</span>
          </v-tooltip>
          <!-- <v-btn small color="#EEEEEE">abi</v-btn> -->
          <!-- <v-btn
            small
            color="warning"
            v-on:click="$emit('function-toggle', item)"
          >pipe</v-btn>
          {{ item.container ? item.container.name : '' }} - {{ item.abiObj ? item.abiObj.name : '' }} -->
          <v-tooltip right>
            <v-btn
              block
              flat
              v-on:click="$emit('function-toggle', item)"
              v-bind:class="[item.styleClasses, 'normaltxt']"
              slot="activator"
            >
              {{ item.container ? item.container.name : '' }} - {{item.abiObj.name}}
            </v-btn>
            <p>Load to Tree on the right</p>
            <p class="text-sm-left" v-if="item.userdoc">{{item.userdoc.notice}}</p>
            <template
                v-if="item.devdoc"
            >
                <template
                    v-for="(param, index) in Object.keys(item.devdoc.params || {})">
                    <p class="text-sm-left">{{param}}: {{item.devdoc.params[param]}}</p>
                </template>
                <p class="text-sm-left" v-if="item.devdoc.return">Returns: {{item.devdoc.return}}</p>
            </template>
          </v-tooltip>
        </v-subheader>
      </template>
    </v-list>
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
