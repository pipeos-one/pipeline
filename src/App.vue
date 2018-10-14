<template>
  <v-app id="app">
    <!-- <v-navigation-drawer app id="nav"></v-navigation-drawer> -->
    <!-- <v-toolbar app></v-toolbar> -->
    <router-link to="/pipe">Pipe</router-link>
    <router-link to="/forms">Forms</router-link>
    <v-content>
      <!-- <v-container fluid> -->
        <router-view></router-view>
      <!-- </v-container> -->
    </v-content>
    <!-- <v-footer app></v-footer> -->
  </v-app>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* .swiper-slide {
    width: 75%;
}
.swiper-slide:nth-child(2n), .swiper-slide:nth-child(4n) {
    width: 25%;
    overflow-y: scroll;
} */
</style>
