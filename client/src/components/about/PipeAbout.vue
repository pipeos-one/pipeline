<template>
    <v-container>
        <div>
            <div class="display-1" style="padding-bottom:25px">
                <v-avatar>
                    <v-img
                        :src="`/pipeline.png`"
                        aspect-ratio="1"
                        class="grey lighten-2"
                        height="44"
                        width="44"
                    ></v-img>
                </v-avatar>
                Pipeline: The Visual IDE
            </div>
            <div style="padding-bottom:20px;">
              <template v-for="(link, i) in infoLinks">
                <div>{{link.name}}: <a :key="i" :href="link.url" target="_blank">{{link.url}}</a></div>
              </template>
            </div>
            <div class="headline" style="padding-bottom:25px">
              Share your dApps by QRcode!
            </div>
            <div class="videoWrapper">
                <iframe width="714" height="420" src="https://www.youtube.com/embed/Op-BSbFJUR4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
            <div class="headline" style="padding-bottom:25px;padding-top:25px;">
              Learn how to create contracts and dApps with Pipeline graphs:
            </div>
            <div class="videoWrapper">
                <iframe width="714" height="420" src="https://www.youtube.com/embed/8xwoyQkYm5U" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
        </div>
    </v-container>
</template>

<script>
//https://youtu.be/Op-BSbFJUR4
export default {
  data() {
    return {
      infoLinks: [
        {
          name: 'github',
          url: 'https://github.com/pipeos-one/pipeline',
        },
        {
          name: 'gitter',
          url: 'https://gitter.im/pipeos-one/pipeline',
        },
        {
          name: 'youtube',
          url: 'https://www.youtube.com/playlist?list=PL323JufuD9JAyaYCEvrnQ5yOAc3ukuNyF',
        },
      ],
    };
  },
};
</script>

<style>
.videoWrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    padding-top: 25px;
    margin-right: 35px;
    height: 0;
}
.videoWrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
