/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import Vue from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/select2.min.css'; // ここを追加
// eslint-disable-next-line import/order
import jQuery from 'jquery';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { faUserNurse } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLine } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

global.jquery = jQuery;
global.$ = jQuery;
// eslint-disable-next-line no-multi-assign
window.$ = window.jQuery = require('jquery');

library.add(faClipboard);
library.add(faFileLines);
library.add(faUserNurse);
library.add(faMagnifyingGlass);
library.add(faLine);
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
