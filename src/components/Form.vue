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
    import VueFormGenerator from "vue-form-generator";
    import Multiselect from 'vue-multiselect';

    import Pipeos from '../namespace/namespace';

    Vue.use(VueFormGenerator);
    Vue.component('multiselect', Multiselect);

    let api = Pipeos.pipeserver.ip + Pipeos.pipeserver.jsonapi;

    let form2 = {
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
    }

    export default {
        components: { Multiselect },
        data () {
            return form2;
        },
        created() {
            Vue.axios.get(`${api}/${this.$router.currentRoute.params.id}`).then((response) => {
              console.log('response', response.data);
              let schema = JSON.parse(response.data.json);
              let schema_orig = JSON.parse(response.data.json);
              let post_api = response.data.uri;
              schema.groups[0].fields.forEach(item => {
                  if (item.label == 'tags') {
                      item.values = [{name: 'aa'}, {name:'bb'}];
                  }
              });
              schema.groups[0].fields.push({
                type: "submit",
                label: "",
                caption: "Submit form",
                validateBeforeSubmit: true,
                onSubmit(model, schema2) {
                    let data = Object.assign({}, model);
                    if (schema_orig.groups[0].fields.find(item => item.label == 'timestamp')) {
                        data.timestamp = new Date();
                    }
                    console.log("data", data);
                    Vue.axios({
                        method: 'post',
                        url: post_api ? (Pipeos.pipeserver.ip + post_api) : api,
                        data,
                        // contentType: "application/json;charset=utf-8",
                        headers: {'Content-Type': 'application/json'},
                    }).then((response) => {
                      console.log('response', response.data);
                    }).catch(function (error) {
                      console.log('error', error);
                    });
                }
              });
              this.schema = schema;
            });
  },
};
</script>

<!-- New step!
     Add Multiselect CSS. Can be added as a static asset or inside a component. -->
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
