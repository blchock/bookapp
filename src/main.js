import Vue from 'vue'
import App from './App.vue'

import './plugins/element.js'
import VueBlu from 'vue-blu'
import 'vue-blu/dist/css/vue-blu.min.css'
Vue.use(VueBlu)
Vue.config.productionTip = false
import './comlib'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
