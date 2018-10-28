<template>
    <div>
        <v-toolbar flat color="#fff" floating>
            <v-btn
                small flat fab
                href="https://github.com/pipeos-one/pipeos-client"
                target="_blank"
            >
                <v-icon>fa-code-branch</v-icon>
            </v-btn>
            <v-btn
                small flat fab
                href="https://gitter.im/pipeos-one/pipeline"
                target="_blank"
            >
                <v-icon>fa-comments</v-icon>
            </v-btn>
            <v-btn
                small flat fab
                href="https://www.youtube.com/watch?v=sC7Hd6Sr1SI&list=PL323JufuD9JAyaYCEvrnQ5yOAc3ukuNyF"
                target="_blank"
            >
                <v-icon>fa-video</v-icon>
            </v-btn>
        </v-toolbar>

        <v-img
          :src="`/pipeline.png`"
          aspect-ratio="1"
          class="grey lighten-2"
          height="40"
          width="40"
        ></v-img>
        Pipeline is a visual IDE for building smart contracts.

    </div>
</template>

<style>
</style>
