import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/admin-home",
      name: "admin-home",
      component: () => import("./views/AdminHome.vue"),
    },
    {
      path: "/user-home",
      name: "user-home",
      
    }
  ],
});

export default router;
