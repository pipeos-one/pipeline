<template>
    <AbiFunction :abi="abi"/>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';
import AbiFunction from '../components/abi/AbiFunction';

const api = Pipeos.pipeserver.api.function;

export default {
    components: {AbiFunction},
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
