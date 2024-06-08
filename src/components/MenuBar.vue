<script setup>
import ocLogo from "/oc_logo.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";

const router = useRouter();

const user = ref(null);
const title = ref("Stories");
const logoURL = ref("");


function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("user");
  user.value = null;
  router.push({ name: "login" });
}


onMounted(() => {
  logoURL.value = ocLogo;
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value === null) {
    router.push({ name: "login" });
  } else {
    if (user.value.type === "admin") {
      title.value = "Admin Dashboard";
    }
    else {
      title.value = "User Dashboard";
    }

  }
});

const drawer = ref(false);


function showStories() {
  router.push({ name: "admin-home" });
}

function showLanguages() {
  router.push({ name: "languages" });
}

function showGenres() {
  router.push({ name: "genres" });
}

function showProfile() {
  router.push({ name: "profile" });
}

function showCountries() {
  router.push({ name: "countries" });
}


function changePassword() {
  router.push({ name: "change-password" });
}

</script>

<template>
  <div>
    <v-app-bar color="primary" app dark>
      <!-- <router-link :to="{ name: 'stories' }">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
        ></v-img>
      </router-link> -->

      <v-app-bar-nav-icon v-if="user !== null && user.type === 'admin'" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn class="mx-2" :to="{ name: 'stories' }"> Stories </v-btn> -->
      <v-btn v-if="user === null" class="mx-2" :to="{ name: 'login' }">
        Login
      </v-btn>
      <!-- <v-btn v-if="user !== null" class="mx-2" :to="{ name: 'ingredients' }">
        Ingredients
      </v-btn> -->
      <v-menu v-if="user !== null" min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar class="mx-auto text-center" color="accent" size="large">
              <span class="white--text font-weight-bold">{{
        `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
      }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="accent">
                <span class="white--text text-h5">{{
          `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
        }}</span>
              </v-avatar>
              <h3>{{ `${user.firstName} ${user.lastName}` }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>


    <v-navigation-drawer v-if="user !== null && user.type === 'admin'" v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
      <v-list nav dense>
        <v-list-item>
          <v-btn block variant="tonal" @click="showStories()">
            Stories
          </v-btn>
        </v-list-item>
        
        <v-list-item>
          <v-btn block variant="tonal" @click="showLanguages()">
            Languages
          </v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn block variant="tonal" @click="showCountries()">
            Countries
          </v-btn>
        </v-list-item>

        <v-list-item>
          <v-btn block variant="tonal" @click="showGenres()">
            Genres
          </v-btn>
        </v-list-item>

        <v-list-item>
          <v-btn block variant="tonal" @click="showProfile()">
            Profile
          </v-btn>
        </v-list-item>

        <v-list-item>
          <v-btn block variant="tonal" @click="changePassword()">
            Change Password
          </v-btn>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>


  </div>
</template>
