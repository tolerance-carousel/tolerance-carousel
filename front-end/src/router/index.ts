import {createRouter, createWebHistory, Router} from 'vue-router';
import VideoPlayer from '../components/VideoPlayer.vue';
import Home from '../components/Home.vue';
import Polis from '../components/Polis.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/video',
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
