// import css from './css/index.css';
// import less from './css/red.less';
// import scss from './css/green.scss';
// // import $ from 'jquery';
// import json from '@/config/data.json'
// import { num } from './foo.js' 
// {
//     let bb = () => 1234;
//     let jsspanString = 'h33asd'
//     document.getElementById('title').innerHTML = `${jsspanString}  zhouxin 1   ${bb}`;
//     $('#jq').html('Hello JSpang2');
//     $('#json').html(json.msg);
//     console.log(num)
// }

import Vue from 'vue'
import App from  './App.vue'
import Router from 'vue-router'
import demo1 from  './page/demo1.vue'
Vue.use(Router)
let router = new Router({
    routes: [
        { path: '/demo1', component: demo1 },
    ]
})
new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
})
