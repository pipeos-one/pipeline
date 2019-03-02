<template>
    <div class="load-ethpm">
            <v-select
                v-model="selectType"
                :items="['swarm', 'ipfs']"
                label="Load EthPM package"
            ></v-select>
            <v-tooltip bottom>
                <v-text-field
                    ref="hash_input"
                    v-if="selectType"
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
        return {selectType: null};
    },
    methods: {
        loadFromEthpm: function() {
            let hash = this.$refs['hash_input'].internalValue;
            if  (!this.selectType) {
                alert('Please select a storage type: ipfs or swarm');
            }
            if (!hash) {
                alert('Please provide a content hash');
            }
            this.$emit(
                'change',
                this.selectType,
                this.$refs['hash_input'].internalValue
            );
        }
    }
}
</script>

<style>
.load-ethpm {
    margin-top: 25px;
}
</style>
