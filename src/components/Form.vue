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

const api = Pipeos.pipeserver.ip + Pipeos.pipeserver.jsonapi;

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
      const schema = JSON.parse(response.data.json);
      const schema_orig = JSON.parse(response.data.json);
      const post_api = response.data.uri;
      schema.groups[0].fields.push({
        type: 'submit',
        label: '',
        caption: 'Submit form',
        validateBeforeSubmit: true,
        onSubmit(model, schema2) {
          const data = Object.assign({}, model);
          if (schema_orig.groups[0].fields.find(item => item.label == 'timestamp')) {
            data.timestamp = new Date();
          }

          schema_orig.groups[0].fields.filter(item => item.type == "vueMultiSelect" && item.selectValues).forEach(item => {
            if (data[item.label]) {
                data[item.label] = data[item.label].map(elem => elem[item.selectValues.value]);
            }
          });

          schema_orig.groups[0].fields.filter(item => item.inputType == "object").forEach(item => {
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

          console.log('data', data);
          Vue.axios({
            method: 'post',
            url: post_api ? (Pipeos.pipeserver.ip + post_api) : api,
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
      schema.groups[0].fields.forEach((item) => {
        if (item.type == "vueMultiSelect" && item.selectValues && item.selectValues.uri) {
            Vue.axios.get(Pipeos.pipeserver.ip + item.selectValues.uri).then((tagresponse) => {
                // console.log('tagresponse', tagresponse.data);
                item.values = tagresponse.data;
                this.schema = schema;
            });
        }
      });
    });
  },
};
</script>

<!-- New step!
     Add Multiselect CSS. Can be added as a static asset or inside a component. -->
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
