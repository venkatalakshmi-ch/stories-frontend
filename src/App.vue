<script setup>
import MenuBar from "./components/MenuBar.vue";
import bg from '/bg.jpeg'; 
</script>

<template>
  <v-app :style="`background: url(${bg}) no-repeat center center fixed; background-size: cover;`">
    <MenuBar :key="$route.fullPath" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>


