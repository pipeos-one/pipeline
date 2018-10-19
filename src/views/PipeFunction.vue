<template>
    <div>
        <template v-for="(input, index) in inputs">
            <PipeIO :io="input" :key="index"/>
        </template>
    </div>
</template>

<script>
import Vue from 'vue';
import PipeIO from '../components/abi/PipeIO.vue';
import Pipeos from '../namespace/namespace';

const api = `${Pipeos.pipeserver.ip}/pipefunction`;

export default {
    components: {PipeIO},
    data() {
        return {inputs: []}
    },
    created() {
        let route = `${api}/${this.$router.currentRoute.params.id}`;
        console.log('route', route);
        Vue.axios.get(route).then((response) => {
            if (response.data) {
                let abi = response.data.abiObj || {};
                this.inputs = abi.inputs || [];
            }
        });
    }
}
</script>
