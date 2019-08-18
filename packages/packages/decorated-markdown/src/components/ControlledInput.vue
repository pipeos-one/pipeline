<template>
  <v-layout row wrap>
    <v-flex xs3 style="padding-right: 5px;padding-left: 5px;">
      <v-select
        v-model="selectorsIndex"
        :items="selectors"
        item-text="name"
        item-value="index"
        hide-no-data
        hide-details
        placeholder="Search"
        dense
      ></v-select>
    </v-flex>
    <v-flex xs3 v-if="selectors[selectorsIndex]" style="padding-right: 5px;padding-left: 5px;">
      <v-select
        v-model="selectors[selectorsIndex].value"
        :label="selectors[selectorsIndex].name"
        :items="selectors[selectorsIndex].values"
        item-text="name"
        item-value="name"
        hide-no-data
        hide-details
        placeholder="Search"
        dense
      ></v-select>
    </v-flex>
    <v-flex xs2>
      <v-btn
        icon
        @click="onGo('include')"
        :disabled="selectors[selectorsIndex] ? false : 'disabled'"
      >
        <v-icon>fa-chevron-right</v-icon>
      </v-btn>
      <!-- <v-btn
        v-if="linkbtn"
        icon
        @click="onGo('link')"
        :disabled="(selectType && selectItem) ? false : 'disabled'"
      >
        <v-icon>fa-link</v-icon>
      </v-btn> -->
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'AliasSelector',
  props: ['value', 'selectors', 'linkbtn'],
  data: () => ({
    selectType: null,
    selectItem: null,
    searchItem: null,
    loadingItems: false,
    selectSeparator: '.',
    selectorsIndex: null
  }),
  mounted() {
    this.setData();
  },
  watch: {
    value() {
      this.setData();
    },
    selectorsIndex() {
      console.log('watch selectorsIndex', this.selectorsIndex);
    },
  },
  methods: {
    setData() {

    },
    onGo(type) {
      if (!this.selectors[this.selectorsIndex]) return;
      const name = this.selectors[this.selectorsIndex].name;
      const subval = this.selectors[this.selectorsIndex].value;

      this.$emit('input', {value: `${name}${subval ? '.' : ''}${subval}` , type: 'included'});
    },
  },
};
</script>
