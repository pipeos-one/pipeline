<template>
  <div class="panel-body">
    <form>
      <vue-form-generator :schema="schema" :model="model" :options="formOptions">
      </vue-form-generator>
    </form>
  </div>
</template>
<script>
import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import Multiselect from 'vue-multiselect';

import Pipeos from '../namespace/namespace';
import libraryToAbi from './introspection/libToAbi.js';

Vue.use(VueFormGenerator);
Vue.component('multiselect', Multiselect);

const api = Pipeos.pipeserver.api.json;

export default {
  components: { Multiselect },
  data() {
    return {
      model: {},
      schema: {},
      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: false,
        fieldIdPrefix: 'user-',
      },
      post_api: null,
    };
  },
  created() {
    let self = this;
    Vue.axios.get(`${api}/${this.$router.currentRoute.params.id}`).then((response) => {
      console.log('response', response.data);
      const schema_name = response.data.name;
      // let schema = JSON.parse(response.data.json);
      let schema = {"fields":[{"type":"input","inputType":"text","label":"Id","model":"_id","visible":false},{"type":"input","inputType":"text","label":"Name","model":"name","required":true},{"type":"input","inputType":"text","label":"uri","model":"uri"},{"type":"input","inputType":"text","label":"json","model":"json"},{"type":"textArea","inputType":"text","label":"timestamp","model":"timestamp","visible":false}]};
      const schema_orig = JSON.parse(response.data.json);
      this.post_api = response.data.uri;
      let submit_location;

      if (schema.groups && schema.groups.length) {
          submit_location = schema.groups[schema.groups.length - 1].fields;
      }
      else {
          if (!schema.fields) schema.fields = [];
          submit_location = schema.fields;
      }
      submit_location.push({
        type: 'submit',
        label: '',
        caption: 'Submit form',
        validateBeforeSubmit: true,
        onSubmit(model, schema2) {
          console.log('moodel', model);
          let data = {};

          if (schema_orig.fields) {
              self.createData(schema_orig.fields, data, model);
              self.prepareData(schema_orig.fields, data);
          }
          if (schema_orig.groups) {
              schema_orig.groups.forEach(group => {
                  data[group.legend] = {};
                  self.createData(group.fields, data[group.legend], model);
                  self.prepareData(group.fields, data[group.legend]);
              });
          }

          if (schema_name === "vueformcontainerJS") {
              self.loadScript(data.container.jssource, data.container.exported, (abi) => {
                  data.container.abi = abi;
                  self.postContainer(data);
              });
          } else {
              self.postContainer(data);
          }
        },
      });

      const setTags = (fields) => {
          fields.forEach((item) => {
            if (item.type == "vueMultiSelect" && item.selectValues && item.selectValues.uri) {
                Vue.axios.get(Pipeos.pipeserver.host + item.selectValues.uri).then((tagresponse) => {
                    // console.log('tagresponse', tagresponse.data);
                    item.values = tagresponse.data;
                    this.schema = schema;
                });
            }
          });
      }
      if (schema.fields) setTags(schema.fields);
      if (schema.groups) {
          schema.groups.forEach(group => setTags(group.fields));
      }
      this.schema = schema;
    });
  },
  methods: {
      createData(fields, data_object, model) {
          fields.forEach(field => {
              data_object[field.model] = model[field.model];
          });
      },
      prepareData(schema_array, data) {
          schema_array.filter(item => item.type == "vueMultiSelect" && item.selectValues).forEach(item => {
            if (data[item.label]) {
                data[item.label] = data[item.label].map(elem => elem[item.selectValues.value]);
            }
          });

          schema_array.filter(item => item.inputType == "object").forEach(item => {
            if (data[item.label]) {
                try {
                    data[item.label] = JSON.parse(data[item.label]);
                }
                catch(error) {
                  console.error(error);
                  alert(`Field ${item.label}: ${error}`);
                  return;
                }
            }
          });
      },
      postContainer(data) {
          console.log('data', data);
          Vue.axios({
            method: 'post',
            url: this.post_api ? (Pipeos.pipeserver.host + this.post_api) : api,
            data,
            // contentType: "application/json;charset=utf-8",
            headers: { 'Content-Type': 'application/json' },
          }).then((response) => {
            console.log('response', response.data);
          }).catch((error) => {
            console.log('error', error);
          });
      },
      loadScript(source, exported, callback) {
          let script = document.createElement('script');
          script.textContent = source;
          document.head.appendChild(script);
          if (!window[exported]) {
              throw new Error(`No ${exported} library to create the ABI.`);
          }
          let abi = libraryToAbi(window[exported]);
          callback(abi);
      }
  }
};

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
