import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("../views/Home.vue"),
        },
        {
            path: "/search",
            name: "search",
            component: () => import("../views/Search.vue"),
        },
        {
            path: "/account",
            name: "account",
            component: () => import("../views/Account.vue"),
        },
        {
            path: "/archives",
            name: "archives",
            component: () => import("../views/Archives.vue"),
        },
        {
            path: "/profile",
            name: "profile",
            component: () => import("../views/Profile.vue"),
        },
        {
            path: "/user/:id",
            component: () => import("../views/User.vue"),
        },
        {
            path: "/collection/:id",
            component: () => import("../views/Collection.vue"),
        },
        {
            path: "/resource/upload",
            component: () => import("../views/Upload.vue"),
        },
        {
            path: "/:pathMatch(.*)",
            redirect: "/",
        },
    ],
});

export default router;
