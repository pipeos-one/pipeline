<template>
  <div class="panel-body">
    <!--<form :action="post_api" method="POST" enctype="application/x-www-form-urlencoded">-->
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

Vue.use(VueFormGenerator);
Vue.component('multiselect', Multiselect);

const api = Pipeos.pipeserver.api.json;

const form2 = {
  model: {
    // name: "Name",
    // validate: "",
    // json: '{"key": "value"}',
    // yaml: "",
    // uri: api,
  },
  schema: {},
  formOptions: {
    validateAfterLoad: false,
    validateAfterChanged: false,
    fieldIdPrefix: 'user-',
  },
};

export default {
  components: { Multiselect },
  data() {
    return form2;
  },
  created() {
    Vue.axios.get(`${api}/${this.$router.currentRoute.params.id}`).then((response) => {
      console.log('response', response.data);
      let schema = JSON.parse(response.data.json);
      const schema_orig = JSON.parse(response.data.json);
      const post_api = response.data.uri;
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
              createData(schema_orig.fields, data, model);
              prepareData(schema_orig.fields, data);
          }
          schema_orig.groups.forEach(group => {
              data[group.legend] = {};
              createData(group.fields, data[group.legend], model);
              prepareData(group.fields, data[group.legend]);
          });

          console.log('data', data);
          Vue.axios({
            method: 'post',
            url: post_api ? (Pipeos.pipeserver.host + post_api) : api,
            data,
            // contentType: "application/json;charset=utf-8",
            headers: { 'Content-Type': 'application/json' },
          }).then((response) => {
            console.log('response', response.data);
          }).catch((error) => {
            console.log('error', error);
          });
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
      schema.groups.forEach(group => setTags(group.fields));
    });
  },
};

function createData(fields, data_object, model) {
    fields.forEach(field => {
        data_object[field.model] = model[field.model];
    });
}

function prepareData(schema_array, data) {
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
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
