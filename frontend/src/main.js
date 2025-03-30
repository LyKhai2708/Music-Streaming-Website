import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import router from './router';
import App from './App.vue';

const app = createApp(App);
app.use(router);
app.use(VueQueryPlugin);
app.mount('#app');
