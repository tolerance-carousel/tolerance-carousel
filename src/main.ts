import {createApp} from 'vue'
import router from './router/index';
import App from './App.vue'
import './index.css'
import '../node_modules/video.js/dist/video-js.css'


createApp(App).use(router).mount('#app');
