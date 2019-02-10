<template>
    <div>
        <v-btn v-on:click="updateServer">Update Server</v-btn>
        <textarea cols="100" rows="10">{{ JSON.stringify(abi) }}</textarea>
    </div>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../../namespace/namespace';
import libraryToAbi from './libToAbi.js';

export default {
    props: ['container', 'instance'],
    data() {
        return {abi: []};
    },
    created() {
        this.makeIntrospection();
    },
    watch: {
        container() {
            // console.log('Introspection watch container', this.container, this.instance);
            this.makeIntrospection();
        }
    },
    methods: {
        makeIntrospection() {
            if (!this.instance) return;
            const entries = Object.entries(this.instance);
            this.abi = libraryToAbi(this.instance);
        },
        updateServer() {
            console.log('updateServer')
            Vue.axios.patch(this.api, {abi: this.abi})
            .then((response) => {

            }).catch(function (error) {
                console.log(error);
            });
        }
    }
}
</script>
