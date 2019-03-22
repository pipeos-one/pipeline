<template>
    <div>
        <v-toolbar flat color="#fff" floating>
            <v-btn
                flat block
                href="https://github.com/pipeos-one/pipeline"
                target="_blank"
            >
                github
            </v-btn>
            <v-btn
                flat block
                href="https://gitter.im/pipeos-one/pipeline"
                target="_blank"
            >
                gitter
            </v-btn>
            <v-btn
                flat block
                href="https://www.youtube.com/watch?v=kOhmv9uj1mI&list=PL323JufuD9JAyaYCEvrnQ5yOAc3ukuNyF&index=9&t=1s"
                target="_blank"
            >
                youtube
            </v-btn>
        </v-toolbar>
        <div>
            <div class="display-1">
                <v-avatar>
                    <v-img
                        :src="`/pipeline.png`"
                        aspect-ratio="1"
                        class="grey lighten-2"
                        height="44"
                        width="44"
                    ></v-img>
                </v-avatar>
                Pipeline: The Visual IDE (WIP)
            </div>
            <v-layout row wrap>
                <v-flex xs12>
                    <br>
                    If you know this video: maximize the window:
                    <img src="/maximize.png"
                        height="32"
                        width="32"
                    ></img> and click next:
                    <img
                        src="/next.png"
                        height="33"
                        width="33"
                    ></img>
                </v-flex>
                <v-flex xs12>
                    <br>
                    You can try out the old Pipeline with +4k contracts by loading <pre class="font-weight-bold">{"title":"Pipeline2","url":"https://pipeline-old.pipeos.one"}</pre> as a Remix plugin.
                </v-flex>
                <v-flex xs12>
                    <br>
                    <iframe width="476" height="280" src="https://www.youtube.com/embed/kOhmv9uj1mI" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                </v-flex>
            </v-layout>
        </div>
    </div>
</template>

<style>
</style>
