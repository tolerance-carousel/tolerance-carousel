import {createRouter, createWebHistory, Router} from 'vue-router';
import VideoPlayer from '../components/video-player/VideoPlayer.vue';
import SharePerspective from '../components/mobile/SharePerspective.vue';
import Admin from '../components/admin/Admin.vue';

const routes = [
    {
        path: '/video/:roomId',
        name: 'Video',
        component: VideoPlayer
    },
    {
        path: '/share-perspective/:roomId',
        name: 'SharePerspective',
        component: SharePerspective
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin
    },
];
const router: Router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
