<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ChatServices from "../services/ChatServices";
import StoryCard from "../components/StoryCard.vue";
import GenreService from "../services/GenreService";
import LanguageService from "../services/LanguageService";
import CountriesService from "../services/CountriesService";



const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


const languages = ref([]);
const genres = ref([]);
const countries = ref([]);

const stories = ref([]);

const myStories = ref([]);

const favoriteStories = ref([]);



const story = ref({
  title: "",
  story: "",
  userId: 1,
  isPublished: false,
  genreId: null,
  languageId: null,
  countryId: null,
});


const openEditDialog = async (story) => {
  router.push({ name: "edit-story", params: { id: story.id } });
};


async function createStory() {

  if (story.value.title === "") {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Title is required!";
    return;
  }

  if (story.value.genreId === null) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Genre is required!";
    return;
  }

  if (story.value.languageId === null) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Language is required!";
    return;
  }

  if (story.value.countryId === null) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Country is required!";
    return;
  }


  story.value.userId = user.value.id;

  await ChatServices.createStory(story.value)
    .then(async () => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story created successfully!";
      await getStories();
      story.value.title = "";
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getStories() {
  await ChatServices.getStories()
    .then((response) => {
      stories.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

const user = ref({});

onMounted(async () => {
  // localStorage.removeItem("user");
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  }
  else {
    router.push({ name: "login" });
  }

  await getStories();
  await getLanguages();
  await getGenres();
  await getCountries();
  await getMyStories();
  await getFavoriteStories();

});

async function getMyStories() {
  await ChatServices.getStoriesByUser(user.value.id)
    .then((response) => {
      myStories.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getFavoriteStories() {
  await ChatServices.getFavoriteStoriesByUser(user.value.id)
    .then((response) => {
      favoriteStories.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}


async function onDeleteStory(story) {
  // confirm dialog
  if (!confirm("Are you sure you want to delete this story?")) {
    return;
  }
  await ChatServices.deleteStory(story.id)
    .then(async () => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story deleted successfully!";
      await getStories();
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}


async function getLanguages() {
  await LanguageService.getLanguages()
    .then((response) => {
      languages.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getGenres() {
  await GenreService.getGenres()
    .then((response) => {
      genres.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getCountries() {
  await CountriesService.getCountries()
    .then((response) => {
      countries.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

const selectedTab = ref(0);

function changeTab(index) {
  selectedTab.value = index;
}



function closeSnackBar() {
  snackbar.value.value = false;
}

</script>

<template>

  <v-container>
    <v-card class="rounded-lg elevation-5">
      <v-card-title class="headline mb-2">Stories </v-card-title>
      <v-row class="mx-2">
        <v-col cols="12" md="4">
          <v-select v-model="story.genreId" :items="genres" item-title="name" item-value="id" label="Genre"
            required></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select v-model="story.languageId" :items="languages" item-title="name" item-value="id" label="Language"
            required></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select v-model="story.countryId" :items="countries" item-title="name" item-value="id" label="Country"
            required></v-select>
        </v-col>
      </v-row>
      <v-card-text>
        <v-text-field v-model="story.title" label="Title" required>
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="createStory()">Create story</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <v-container>

    <v-tabs class="my-5 rounded-lg elevation-5" bg-color="primary" fixed-tabs>
     
      <v-tab v-for="(tab, index) in ['All Stories', 'My Stories', 'Favorite Stories']" :key="index"
        @click="changeTab(index)">
        {{ tab }}
      </v-tab>
    </v-tabs>

    <v-row v-if="selectedTab == 0">
      <v-col cols="12" v-for="story in stories" :key="story.id">
        <StoryCard :story="story" @edit-story="openEditDialog" @delete-story="onDeleteStory" />
      </v-col>
    </v-row>

    <v-row v-if="selectedTab == 1">
      <v-col cols="12" v-for="story in myStories" :key="story.id">
        <StoryCard :story="story" @edit-story="openEditDialog" @delete-story="onDeleteStory" />
      </v-col>
    </v-row>

    <v-row v-if="selectedTab == 2">
      <v-col cols="12" v-for="story in favoriteStories" :key="story.id">
        <StoryCard :story="story" @edit-story="openEditDialog" @delete-story="onDeleteStory" />
      </v-col>
    </v-row>

    
  </v-container>


  <v-snackbar v-model="snackbar.value" rounded="pill">
    {{ snackbar.text }}

    <template v-slot:actions>
      <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>


<style scoped>
  .rounded-lg {
    border-radius: 20px;
  }

  .elevation-5 {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  }
</style>