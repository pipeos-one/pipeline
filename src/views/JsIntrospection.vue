<template>
    <Introspection :container="container" :instance="instance" :api="api"/>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';
import Introspection from '../components/introspection/Introspection';

let container_api = Pipeos.pipeserver.api.container;

export default {
    components: {
        Introspection,
        // Introspection: () => {
        //     let id = this.$router.currentRoute.params.id;
        //     console.log('--id', id);
        //     return new Promise((resolve, reject) => {
        //         let script = document.createElement('script')
        //         script.onload = () => {
        //             // resolve(import('R'))
        //             console.log('----------loaded------')
        //             console.log(R);
        //             resolve()
        //         }
        //         script.async = true
        //         script.src = `${container_api}/${id}/js`;
        //         document.head.appendChild(script);
        //         console.log('script', script);
        //     })
        // },
    },
    data() {
        let id = this.$router.currentRoute.params.id;

        return {
            container: {},
            instance: null,
            api: `${container_api}/${id}`,
        }
    },
    mounted() {
        let script = document.createElement('script');
        script.onload = () => {
            Vue.axios.get(this.api).then((response) => {
                this.container = response.data;
                this.instance = window[response.data.container.exported];
            }).catch(function (error) {
                console.log(error);
            });
        }
        script.async = true;
        script.src = `${this.api}/js`;
        document.head.appendChild(script);
    }
}
</script>
