<template>
    <form>
      <vue-form-generator :schema="schema" :model="model" :options="formOptions">
      </vue-form-generator>
    </form>
</template>

<script>
import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';

import ioToFormSchema from './ioToFormSchema.js';

Vue.use(VueFormGenerator);

let schema = {
    legend: 'Schema',
    fields: [],
};

export default {
    props: ['io'],
    data() {
        schema.fields.push(ioToFormSchema(this.io));
        return {schema: schema, model: {}, formOptions: {}}
    },
}
</script>
