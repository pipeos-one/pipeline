<template>
  <v-layout row wrap style="text-align: left;">
    <v-flex xs12 v-if="selectors.length > 0">
      <ControlledInput v-model="selectorAddition" :selectors="selectors"/>
    </v-flex>
    <v-flex xs6 style='padding-right:10px;'>
      <vue-simplemde
        v-model='editorContent'
        ref='markdownEditor'
        :configs='configs'
      />
    </v-flex>
    <v-flex xs6 style='padding-left:10px;'>
      <v-flex xs12>
        <MarkdownView
          :value="editorContent"
          :onPreHtml="onPreHtml"
          :onPostHtml="onPostHtml"
        />
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
import {VLayout, VFlex} from 'vuetify/lib';
import VueSimplemde from 'vue-simplemde';
import MarkdownView from './MarkdownView';
import ControlledInput from './ControlledInput';

export default {
  name: 'MarkdownEdit',
  props: ['value', 'addition', 'onPreHtml', 'onPostHtml', 'selectors'],
  components: {ControlledInput, VueSimplemde, VLayout, VFlex, MarkdownView},
  data() {
    return {
      selectorAddition: null,
      editorContent: '',
      configs: {
        indentWithTabs: false,
        toolbar: [
          'bold', 'italic', 'heading', '|',
          'quote', 'unordered-list', 'ordered-list', '|',
          'link', 'image',
        ],
      },
    };
  },
  mounted() {
    this.setData();
  },
  watch: {
    value() {
      this.setData();
    },
    addition() {
      this.onAddition(this.addition);
    },
    selectorAddition() {
      this.onAddition(this.selectorAddition);
    },
    editorContent() {
      const value = this.value ? this.value : '';
      if (this.editorContent !== value) {
        this.$emit('input', this.editorContent);
      }
    },
  },
  methods: {
    setData() {
      this.editorContent = this.value ? this.value : '';
    },
    onAddition(addition) {
      let text = `[[${addition.value}]]`;
      if (addition.type === 'link') {
        text += '()';
      }
      const doc = this.$refs.markdownEditor.simplemde.codemirror.getDoc();
      const cursor = doc.getCursor();
      doc.replaceRange(text, cursor);
    },
  },
};
</script>

<style>
  @import '~simplemde/dist/simplemde.min.css';
</style>
