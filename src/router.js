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
      component: () => import("./views/UserHome.vue"),
    },
    {
      path: "/edit-story/:id",
      name: "edit-story",
      component: () => import("./views/EditStory.vue"),
    },
    {
      path: "/languages",
      name: "languages",
      component: () => import("./views/Languages.vue"),
    },
    {
      path: "/genres",
      name: "genres",
      component: () => import("./views/Languages.vue"),
    },
    {
      path: "/countries",
      name: "countries",
      component: () => import("./views/Countries.vue"),

    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/Profile.vue"),
    }

  ],
});

export default router;
