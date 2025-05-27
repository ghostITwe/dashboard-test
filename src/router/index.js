import { createRouter, createWebHistory } from 'vue-router'
import Board from "@/views/Board.vue";
import Home from "@/views/Home.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/board',
        name: 'board',
        component: Board
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;