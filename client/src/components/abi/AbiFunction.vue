<template>
    <form>
      <vue-form-generator :schema="schema" :model="model" :options="formOptions">
      </vue-form-generator>
    </form>
</template>

<script>
import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import {inputToFormSchema, outputToFormSchema} from './ioToFormSchema.js';

Vue.use(VueFormGenerator);

export default {
    props: ['abi'],
    data() {
        return {
            schema: {},
            model: {},
            formOptions: {},
        }
    },
    created() {
        this.setSchema();
    },
    watch: {
        abi: function() {
            this.setSchema();
        }
    },
    methods: {
        setSchema: function() {
            let schema = {groups: [], fields: []};
            let submit_location = schema.fields;

            if (this.abi.inputs && this.abi.inputs.length) {
                schema.groups.push({
                    legend: 'Inputs',
                    fields: this.abi.inputs.map(io => inputToFormSchema(io)),
                });
                submit_location = schema.groups[0].fields;
            }
            if (this.abi.outputs && this.abi.outputs.length) {
                schema.groups.push({
                    legend: 'Outputs',
                    fields: this.abi.outputs.map(io => outputToFormSchema(io)),
                });
            }

            submit_location.push({
                type: 'submit',
                label: this.name,
                caption: this.name,
                validateBeforeSubmit: true,
                onSubmit(model, schema2) {
                    console.log('onSubmit', model, schema2);
                }
            });

            this.schema = schema;
        }
    }
}
</script>
