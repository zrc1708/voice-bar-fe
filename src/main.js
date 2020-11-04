import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/css/normalize.css'
import './assets/css/common.less'

Vue.config.productionTip = false

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8877/'
Vue.prototype.$http = axios

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
