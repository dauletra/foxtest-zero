import Vue from 'vue'
import App from './App.vue'
import { VueHammer } from 'vue2-hammer'

Vue.use(VueHammer);

import 'bootstrap/dist/css/bootstrap.css'

new Vue({
  el: '#app',
  render: h => h(App)
});
