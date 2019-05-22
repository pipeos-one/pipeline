<template>
    <div>
            <v-select
                v-model="selectType"
                :items="['swarm', 'ipfs']"
                :error="selectError"
                :error-messages="selectErrorMsg"
                placeholder="Load EthPM package"
            ></v-select>
            <v-tooltip bottom>
                <v-text-field
                    v-model="hashInput"
                    v-if="selectType"
                    :error="inputError"
                    :error-messages="inputErrorMsg"
                    :placeholder="selectType === 'swarm' ? 'swarm hash' : 'ipfs hash'"
                    append-icon="fa-download"
                    @click:append="loadFromEthpm"
                    slot="activator"
                    style="margin-top: -15px"
                ></v-text-field>
                <p>EthPM ipfs/swarm url</p>
            </v-tooltip>
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
