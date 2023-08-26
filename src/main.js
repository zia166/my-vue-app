import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.css';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyABDC0dUVtV6uOZjepOYjTd2eKdr4FwtDo',
     // Add any additional libraries you need
  }
})
new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')