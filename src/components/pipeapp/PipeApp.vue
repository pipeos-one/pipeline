<template>
    <div class='fit'>
        <v-tabs fixed-tab left class="fullheight">
            <v-tab ripple key="solidity">Solidity</v-tab>
            <v-tab ripple key="graph">Graph</v-tab>
            <v-tab-item
                key="solidity"
                class="fullheight swiper-margin"
            >
                <v-toolbar flat color="#fff" height="47">
                    <v-tooltip bottom>
                        <v-btn
                            small flat fab
                            slot="activator"
                            v-on:click="clipboardCopy('contractSource')"
                        >
                            <v-icon>save</v-icon>
                        </v-btn>
                        <span>Copy to clipboard</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                        <v-btn
                            small flat fab
                            slot="activator"
                            v-on:click="$emit('contract-deploy')"
                        >
                            <v-icon>call_made</v-icon>
                        </v-btn>
                        <span>Deploy contract</span>
                    </v-tooltip>
                </v-toolbar>
                <textarea ref='contractSource' class='source-txtar'>{{contractSource}}</textarea>
            </v-tab-item>
            <v-tab-item
                key="graph"
                class="fullheight swiper-margin"
            >
                <v-toolbar flat color="#fff" height="47">
                    <v-tooltip bottom>
                        <v-btn
                            small flat fab
                            slot="activator"
                            v-on:click="clipboardCopy('graphSource')"
                        >
                            <v-icon>save</v-icon>
                        </v-btn>
                        <span>Copy to clipboard</span>
                    </v-tooltip>
                </v-toolbar>
                <textarea ref='graphSource' class='source-txtar'>{{graphSource}}</textarea>
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
export default {
    props: ['contractSource', 'graphSource'],
    methods: {
        clipboardCopy: function(reference) {
            this.$refs[reference].select();
            document.execCommand("copy");
        }
    }
}
</script>


<style>
.fit {
    height: 100%;
    width: 100%;
}
.source-txtar {
    height: 87%;
    width: 100%;
    font-family: monospace;
}
</style>
