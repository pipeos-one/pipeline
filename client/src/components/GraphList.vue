<template>
  <div class="paginatedlist">
      <div class="text-xs-center" style="padding-top:10px;padding-bottom:10px;">
          <v-pagination
            :length="pages"
            :value="currentPage"
            total-visible="11"
            v-on:input="changePage"
          ></v-pagination>
      </div>
    <div v-if="items.length === 0">
        <p class="text-xs-left caption font-weight-medium">No graphs were found.</p>
    </div>
    <v-list v-if="items.length > 0">
          <v-list-tile
            v-for="item in items"
            :key="item._id"
            :style="selected === item._id ? 'background-color:#8BB1F9;': ''"
          >
            <v-list-tile-content>
              <v-tooltip right>
                <v-list-tile-title
                  v-text="item.name"
                  slot="activator"
                  @click="onSelected(item)"
              ></v-list-tile-title>
                <span v-html="showMarked(item.markdown)"></span>
              </v-tooltip>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn
                  small flat fab
                  @click="onShowQR(item)"
              >
                  <v-icon small>fa-qrcode</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
    </v-list>
    <v-dialog
      v-model="dialogGraph"
      hide-overlay
      width="70%"
    >
      <v-card v-if="dialogGraph && qritem">
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <p class="subheading">
                Share & run this dApp with PipEm!
              </p>
              <p class="caption">
                On mobile, use a wallet (Opera Touch, Metamask) and scan the QRcode.
              </p>
              <p class="caption">
                On desktop, make sure you have web3 enabled (e.g. Metamask) and go to:
              </p>
            </v-flex>
            <v-flex xs12>
              <a :href="pipemLink(qritem)" target="_blank">{{pipemLink(qritem)}}</a>
              <v-btn small icon @click="clipboardCopy(pipemLink(qritem))">
                <v-icon small>fa-copy</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs12>
              <qrcode :value="pipemLink(qritem)" :options="{ width: 200 }"></qrcode>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import marked from 'marked';
import Vue from 'vue';
import PipeTree from './PipeTree';
import Pipeos from '../namespace/namespace';

export default {
    components: {
        PipeTree,
    },
    props: ['items', 'pages', 'currentPage'],
    data() {
      return {
        qrroot: Pipeos.pipem,
        item: null,
        selected: null,
        dialogGraph: null,
        qritem: null,
      };
    },
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
        showMarked(markdown) {
          const snippet = markdown.substring(0, 100);
          return marked(snippet);
        },
        onSelected(item) {
          this.selected = item._id;
          this.$emit('selected', item);
        },
        onShowQR(item) {
          this.qritem = item;
          this.dialogGraph = true;
        },
        onPipemLink(item) {
          window.open(this.pipemLink(item), 'blank');
        },
        pipemLink(item) {
          return `${Pipeos.pipem}${item._id}`;
        },
        clipboardCopy(url) {
          const aux = document.createElement("input");
          aux.setAttribute("value", url);
          document.body.appendChild(aux);
          aux.select();
          document.execCommand("copy");
          document.body.removeChild(aux);
        },
    },
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
.v-pagination>li {
    margin: 0 !important;
}
.v-pagination__item, .v-pagination__navigation {
    max-width: 20px;
    max-height: 20px;
    min-width: 22px !important;
    padding: 0 !important;
    margin: 0 2px !important;
    font-size: 10px;
}
.v-pagination__navigation .v-icon {
    font-size: 14px !important;
}
.paginatedlist .v-list {
    padding: 0;
}
</style>
