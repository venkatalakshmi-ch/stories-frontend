<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import ChatService from "../services/ChatServices.js";
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

const selectedGenreFilterId = ref(null);
const selectedLanguageFilterId = ref(null);
const selectedCountryFilterId = ref(null);

const user = ref({});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value.type === "admin") {
    router.push({ name: "admin-home" });
  }
  await getStories();
  await getGenres();
  await getLanguages();
  await getCountries();
  await getMyStories();
  await getFavoriteStories();
}
);

function editStory(createdStory) {
  router.push({ name: "edit-story", params: { id: createdStory.id } });
};


const stories = ref([]);

async function getStories() {
  try {
    const response = await ChatService.getPublishedStories();
    stories.value = response.data;
    filterStories();
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to get stories";
  }
}

async function previewStory(story) {
  router.push({ name: "preview", params: { id: story.id } });
}

async function getGenres() {
  try {
    const response = await GenreService.getGenres();
    genres.value = response.data;
    // selectedGenreFilterId.value = genres.value[0].id;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to get genres";
  }
}

async function getLanguages() {
  try {
    const response = await LanguageService.getLanguages();
    languages.value = response.data;
    // selectedLanguageFilterId.value = languages.value[0].id;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to get languages";
  }
}

async function getCountries() {
  try {
    const response = await CountriesService.getCountries();
    countries.value = response.data;
    // selectedCountryFilterId.value = countries.value[0].id;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to get countries";
  }
}


const filterdStories = ref([]);


function filterStories() {
  filterdStories.value = stories.value.filter((story) => {
    return (
      (selectedGenreFilterId.value === null ||
        story.genre.id === selectedGenreFilterId.value) &&
      (selectedLanguageFilterId.value === null ||
        story.language.id === selectedLanguageFilterId.value) &&
      (selectedCountryFilterId.value === null ||
        story.country.id === selectedCountryFilterId.value)
    );
  });

  console.log(filterdStories.value);
}


async function onGenreFilterChange() {
  console.log(selectedGenreFilterId.value);
  filterStories();
}

async function onLanguageFilterChange() {
  filterStories();
}

async function onCountryFilterChange() {
  filterStories();
}


const myStories = ref([]);

const favoriteStories = ref([]);


const selectedTab = ref(0);

function changeTab(index) {
  selectedTab.value = index;
}


async function getMyStories() {
  await ChatService.getStoriesByUser(user.value.id)
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
  await ChatService.getFavoriteStoriesByUser(user.value.id)
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


const story = ref({
  title: "",
  story: "",
  userId: 1,
  isPublished: false,
  genreId: null,
  languageId: null,
  countryId: null,
});

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

await ChatService.createStory(story.value)
  .then(async (response) => {
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = "Story created successfully!";
    editStory(response.data);
    story.value.title = "";
  })
  .catch((error) => {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  });
}


function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-app-bar color="primary" class="pr-3" dark>

<v-container>
  

  <v-tabs bg-color="primary" fixed-tabs>

    <v-tab v-for="(tab, index) in ['All Stories', 'My Stories', 'Favorite Stories', 'Create new story']" :key="index"
      @click="changeTab(index)">
      {{ tab }}
    </v-tab>
  </v-tabs>

</v-container>
</v-app-bar>
<v-container>

    <v-row v-if="selectedTab == 0">
      <v-container>
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="4">
                <v-select v-model="selectedGenreFilterId" :items="genres" label="Genre" item-title="name"
                  item-value="id" @update:modelValue="onGenreFilterChange"></v-select>
              </v-col>
              <v-col cols="4">
                <v-select v-model="selectedLanguageFilterId" :items="languages" label="Language" item-title="name"
                  item-value="id" @update:modelValue="onLanguageFilterChange"></v-select>
              </v-col>
              <v-col cols="4">
                <v-select v-model="selectedCountryFilterId" :items="countries" label="Country" item-title="name"
                  item-value="id" @update:modelValue="onCountryFilterChange"></v-select>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-container>
      <v-col cols="12" v-for="story in filterdStories" :key="story.id">
        <StoryCard :story="story" />
      </v-col>
    </v-row>

    <v-row v-if="selectedTab == 1">
      <v-col cols="12" v-for="story in myStories" :key="story.id">
        <StoryCard :story="story" />
      </v-col>
    </v-row>

    <v-row v-if="selectedTab == 2">
      <v-col cols="12" v-for="story in favoriteStories" :key="story.id">
        <StoryCard :story="story" />
      </v-col>
    </v-row>

    <v-row v-if="selectedTab == 3">
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
