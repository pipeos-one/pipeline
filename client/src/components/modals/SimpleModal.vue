<template>
    <v-layout row justify-center>
        <v-dialog
            v-model="modalIsActive"
            max-width="300"
        >
            <v-card>
                <v-card-text>{{modalMessage}}</v-card-text>
                <v-container v-if="modalInput">
                    <v-flex xs12>
                        <v-text-field
                            v-model="inputValue"
                            :label="modalInput.label"
                            :placeholder="modalInput.placeholder"
                        ></v-text-field>
                    </v-flex>
                </v-container>
                <v-card-actions v-if="hasChoice">
                    <v-spacer></v-spacer>
                    <v-btn
                        flat
                        @click="$emit('change', false, inputValue)"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                        flat
                        @click="$emit('change', true, inputValue)"
                    >
                        Ok
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
export default {
    props:['modalIsActive', 'modalMessage', 'hasChoice', 'modalInput'],
    data () {
        return {
            inputValue: '',
        };
    },
    mounted() {
        this.inputValue = this.modalInput.value;
    },
    watch: {
        modalInput() {
            this.inputValue = this.modalInput.value;
        },
    },
};
</script>
