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
    selectedGenreFilterId.value = genres.value[0].id;
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
    selectedLanguageFilterId.value = languages.value[0].id;
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
    selectedCountryFilterId.value = countries.value[0].id;
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



function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>

    <v-tabs class="my-5 rounded-lg elevation-5" bg-color="primary" fixed-tabs>

      <v-tab v-for="(tab, index) in ['All Stories', 'My Stories', 'Favorite Stories']" :key="index"
        @click="changeTab(index)">
        {{ tab }}
      </v-tab>
    </v-tabs>

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


  </v-container>
</template>
