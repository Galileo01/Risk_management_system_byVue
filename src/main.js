import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element.js';

import Amap from 'vue-amap';
import BreadNav from 'components/com/BreadNav';

//在全局注册 组件BreadNav
Vue.component('BreadNav', BreadNav);

Vue.config.productionTip = false;

Vue.use(Amap);
Amap.initAMapApiLoader({
    // 申请的高德key
    key: '6e350de4372aea6e14e89161fe4816c0',
    // 插件集合
    plugin: ['ToolBar', 'MapType'],
});
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');
