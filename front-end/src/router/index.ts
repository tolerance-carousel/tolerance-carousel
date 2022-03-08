import {createRouter, createWebHistory, Router} from 'vue-router';
import VideoPlayer from '../components/VideoPlayer.vue';
import Polis from '../components/mobile/Polis.vue';

const routes = [
    {
        path: '/video/:themeId',
        name: 'Video',
        component: VideoPlayer
    },
    {
        path: '/polis',
        name: 'Polis',
        component: Polis
    },
];
const router: Router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
