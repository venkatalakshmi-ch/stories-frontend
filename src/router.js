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
      component: () => import("./views/Genres.vue"),
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
    },
    {
      path:"/preview/:id",
      name:"preview",
      component: () => import("./views/StoryPreview.vue"),
    },
    {
      path:"/change-password",
      name:"change-password",
      component: () => import("./views/ChangePassword.vue"),
    },
    { 
      path:"/age-groups",
      name:"age-groups",
      component: () => import("./views/AgeGroups.vue"),
    },

  ],
});

export default router;
