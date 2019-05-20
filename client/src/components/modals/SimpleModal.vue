<template>
    <v-layout row justify-center>
        <v-dialog
            v-model="modalIsActive"
            max-width="300"
        >
            <v-card>
                <v-card-text>{{modalMessage}}</v-card-text>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
export default {
    props:['modalIsActive', 'modalMessage'],
    data () {
        return {};
    },
};
</script>
