import Vue from 'vue';
import './plugins/axios';
import '@babel/polyfill';

import VueFormGenerator from 'vue-form-generator/dist/vfg-core';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
// import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@fortawesome/fontawesome-free/css/all.css';

import 'vue-form-generator/dist/vfg-core.css';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';

Vue.use(Vuetify, {
    iconfont: 'fa',
});

Vue.config.productionTip = false;


new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
