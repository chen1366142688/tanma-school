import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import axios from 'axios';
import tinymce from 'tinymce';
import echarts from 'echarts';
import '../theme/index.less';
import htmlToPdf from '@/libs/htmlToPdf';

Vue.use(iView);
Vue.use(tinymce);
Vue.use(htmlToPdf);
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;
Vue.prototype.$tableScroll = (table) => {
    table.$refs.body.scrollTop = 0;
    table.$refs.body.scrollLeft = 0;
  };

Vue.prototype.$Message.config({
    top: 400,
    duration: 2
});
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    mounted () {
        this.$store.commit('updateMenulist');
    }
});
