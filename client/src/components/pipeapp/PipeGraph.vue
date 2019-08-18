<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-text-field
        v-model="graphName"
        label="Graph name"
        solo
      ></v-text-field>
    </v-flex>
    <v-flex xs12>
      <MarkdownEdit
        v-model="markdownText"
        :onPreHtml="onPreHtml"
        :onPostHtml="onPostHtml"
        :selectors="selectors"
      />
    </v-flex>
    <v-flex xs12 v-if="onUpdateInputs">
      <AbiFunction :abi="abi" @change="inputChanged"/>
    </v-flex>
  </v-layout>
</template>

<script>
import {MarkdownEdit} from 'decorated-markdown';
import {AbiFunction} from 'vue-ethabi';
import {getItemsFromMd} from './utils';

const aliasBtns = (alias) => {
  return `<button type="button" onClick='updateInputs("${alias}")' style="padding-right: 5px;padding-left: 5px;"><i aria-hidden="true" class="v-icon v-icon--link fa fa-edit theme--light" style="font-size: 15px;padding-bottom: 5px;"></i></button>`;
};

const aliasCheckbox = (alias) => {
  return `<input type="checkbox" name="${alias}" value="false" onClick="updateEvents("${alias}")"/>`;
}

const aliasMdBtns = {
  inputs: aliasBtns,
  events: aliasCheckbox,
}

export default {
  props: ['value', 'abi'],
  components: {MarkdownEdit, AbiFunction},
  data() {
    return {
      graphName: null,
      markdownText: '',
      onUpdateInputs: false,
      selectors: [],
    };
  },
  mounted() {
    this.setData();
    window.updateInputs = this.updateInputs;
    window.updateEvents = this.updateEvents;
  },
  watch: {
    value() {
      this.setData();
    },
    abi() {
      this.setSelectors();
    },
    graphName() {
      this.value.name !== this.graphName && this.emitChange();
    },
    markdownText() {
      this.value.markdown !== this.markdownText && this.emitChange();
    },
  },
  methods: {
    setData() {
      if (!this.value) return;
      this.graphName = this.value.name;
      this.markdownText = this.value.markdown;
      this.setSelectors();
    },
    setSelectors() {
      if (!this.abi) return;
      this.selectors = [
        {
          name: 'inputs',
          values: this.abi.inputs,
          index: 0,
        },
        {
          name: 'outputs',
          values: this.abi.outputs,
          index: 1,
        },
      ];
    },
    emitChange() {
      const newvalue = Object.assign({}, this.value, {
        name: this.graphName,
        markdown: this.markdownText,
      });
      this.$emit('input', newvalue);
    },
    onPreHtml(markdown) {
      return markdown;
    },
    onPostHtml(html) {
      return this.replaceMarkdownItems(html);
    },
    replaceMarkdownItems(html) {
      const items = getItemsFromMd(html);

      items.included.full.forEach((match, i) => {
        const root = items.included.aliases[i].split('.')[0];
        html = html.replace(match, `${items.included.aliases[i]}${aliasMdBtns[root] ? aliasMdBtns[root](items.included.aliases[i]) : ''}`);
      });

      return html;
    },
    updateInputs(alias) {
      this.onUpdateInputs = true;
    },
    updateEvents(alias) {
      // TODO
    },
    inputChanged(value) {
      this.$emit('change', value);
    }
  },
};
</script>
