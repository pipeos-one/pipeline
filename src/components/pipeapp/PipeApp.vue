<template>
    <div class='fit'>
        <v-toolbar flat color="#fff" height="47">
            <v-tooltip bottom>
                <v-btn
                    small flat fab
                    slot="activator"
                    v-on:click="clipboardCopy"
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
        <div class='fit'>
        <!-- <v-textarea
          box
          ref='contractSource'
          name='contractSource'
          label='Pipeline Contract'
          class='source-txtar'
          height='100%'
          :value='contractSource'
        ></v-textarea> -->
        </div>
    </div>
</template>

<script>
export default {
    props: ['contractSource'],
    methods: {
        clipboardCopy: function(event) {
            this.$refs.contractSource.select();
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
