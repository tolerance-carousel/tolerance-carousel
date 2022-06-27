import {createApp} from 'vue'
import router from './router/index';
import store from './store/index';
import App from './App.vue'
import './index.css'
import vueVimeoPlayer from 'vue-vimeo-player'

createApp(App).use(router).use(store).use(vueVimeoPlayer).mount('#app');
