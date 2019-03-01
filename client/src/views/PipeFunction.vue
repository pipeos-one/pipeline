<template>
    <AbiFunctionForm :abi="abi"/>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';
import AbiFunctionForm from '../components/abi/AbiFunctionForm';

const api = Pipeos.pipeserver.api.function;

export default {
    components: {AbiFunctionForm},
    data() {
        return {
            abi: {},
        }
    },
    created() {
        let route = `${api}/${this.$router.currentRoute.params.id}`;
        console.log('route', route);
        Vue.axios.get(route).then((response) => {
            if (response.data) {
                this.abi = response.data.gapi || {};
            }
        });
    },
}
</script>
