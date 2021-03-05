import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueAxios from "vue-axios";
import axios from "axios";
// import * as VueGoogleMaps from "vue2-google-maps";

Vue.config.productionTip = false

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: "AIzaSyBbGY7ji1hmf81p2LbTPHOOgXCroqeEmk8",
//     libraries: "places" // necessary for places input
//   }
// });

new Vue({
  router,
  store,
  vuetify,
  VueAxios,
  axios,
  render: h => h(App),
}).$mount('#app')
 