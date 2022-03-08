import {createRouter, createWebHistory, Router} from 'vue-router';
import VideoPlayer from '../components/VideoPlayer.vue';
import SharePerspective from '../components/mobile/SharePerspective.vue';

const routes = [
    {
        path: '/video/:themeId',
        name: 'Video',
        component: VideoPlayer
    },
    {
        path: '/share-perspective/:themeId',
        name: 'SharePerspective',
        component: SharePerspective
    },
];
const router: Router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
