import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
import '@5a/css/dist/helpers.css'
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/agate.css';
hljs.registerLanguage('json', json);
Vue.use(hljs.vuePlugin);
Vue.use(ElementUI);
Vue.use(iView);

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
