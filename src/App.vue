<template>
  <v-app id="app">
    <v-navigation-drawer app id="nav">
        <v-btn flat>Link One</v-btn>
        <router-link to="/pipe">Pipe</router-link>
        <router-link to="/forms">Forms</router-link>
    </v-navigation-drawer>
    <!-- <v-toolbar app></v-toolbar> -->
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
