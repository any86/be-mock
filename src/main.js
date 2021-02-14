import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
import '@5a.css/helpers'
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/agate.css';
import VueClipboard from 'vue-clipboard2'
import {
  $http
} from '@/apis';
Vue.prototype.$http = $http;

// 复制
Vue.use(VueClipboard);
Vue.prototype.$copy = (text) => {
    Vue.prototype.$copyText(text).then((e) => {
        Vue.prototype.$Message.success({
          content:'复制成功',
        });
    });
};

hljs.registerLanguage('json', json);
Vue.use(hljs.vuePlugin);
Vue.use(iView);

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
