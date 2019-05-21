<template>
    <div class="load-ethpm">
            <v-select
                v-model="selectType"
                :items="['swarm', 'ipfs']"
                :error="selectError"
                :error-messages="selectErrorMsg"
                label="Load EthPM package"
            ></v-select>
            <v-tooltip bottom>
                <v-text-field
                    v-model="hashInput"
                    v-if="selectType"
                    :error="inputError"
                    :error-messages="inputErrorMsg"
                    label="ipfs/swarm hash"
                    placeholder="QmcBYqgY6R7aGaqG8EXg4YvQp7L5vriuLdaEvXQ2atdqRT"
                    append-icon="fa-download"
                    @click:append="loadFromEthpm"
                    slot="activator"
                ></v-text-field>
                <p>EthPM ipfs/swarm url</p>
            </v-tooltip>
        </v-layout>
    </div>
</template>

<script>
export default {
    data() {
        return {
            selectType: null,
            selectError: false,
            selectErrorMsg:[],
            hashInput: null,
            inputError: false,
            inputErrorMsg: [],
        };
    },
    methods: {
        loadFromEthpm: function() {
            if  (!this.selectType) {
                this.selectError = true;
                this.selectErrorMsg = ['Please select a storage type: ipfs or swarm'];
                return;
            } else {
                this.selectError = false;
                this.selectErrorMsg = [];
            }
            if (!this.hashInput) {
                this.inputError = true;
                this.inputErrorMsg = 'Please provide a content hash';
                return;
            } else {
                this.inputError = false;
                this.inputErrorMsg = [];
            }
            this.$emit(
                'change',
                this.selectType,
                this.hashInput,
            );
        },
    }
}
</script>

<style>
.load-ethpm {
    margin-top: 25px;
}
</style>
