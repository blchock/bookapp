import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import VueBlu from 'vue-blu'
import 'vue-blu/dist/css/vue-blu.min.css'
import VueCookies from 'vue-cookies'

Vue.use(VueBlu)
Vue.use(VueCookies)
Vue.config.productionTip = false
VueCookies.config('200d')
import './comlib'

new Vue({
  render: h => h(App),
}).$mount('#app')
