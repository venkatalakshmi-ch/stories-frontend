<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter, useRoute } from "vue-router";
import ChatService from "../services/ChatServices.js";


const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const user = ref({});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value.type === "admin") {
    router.push({ name: "admin-home" });
  }
  await getStory();
}
);

const story = ref(null);

// read the story id from the route params
const route = useRoute();

async function getStory() {
  const id = ref(route.params.id);

  try {
    const response = await ChatService.getStory(id.value);
    story.value = response.data;
    await checkIfFavorite();
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to get story";
  }
}

const isFavoriteStory = ref(false);

async function checkIfFavorite() {
  try {
    const response = await ChatService.isFavoriteStory(story.value.id, user.value.id);
    if (response.data) {
      isFavoriteStory.value = response.data.isFavorite;
    }
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to check if favorite";
  }
}

async function addFavorite() {
  try {
    await ChatService.addFavoriteStory(story.value.id, user.value.id);
    isFavoriteStory.value = true;
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = "Story added to favorites";
    await checkIfFavorite();
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to add story to favorites";
  }
}


async function removeFavorite() {
  try {
    await ChatService.removeFavoriteStory(story.value.id, user.value.id);
    isFavoriteStory.value = false;
    snackbar.value.value = true;
    snackbar.value.color = "success";
    snackbar.value.text = "Story removed from favorites";
    await checkIfFavorite();
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to remove story from favorites";
  }
}




function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div>
      <v-card v-if="story != null">
        <v-card-actions>
          <v-card-title>{{ story.title }} <v-chip class="ma-2" color="primary" label>
              <v-icon start icon="mdi-account-circle-outline"></v-icon>
              {{ story.user.firstName }} {{ story.user.lastName }}
            </v-chip>
            <v-chip class="ma-2" :color="story.isPublished ? 'green' : 'red'" label>
              <v-icon start icon="mdi-check-circle-outline"></v-icon>
              {{ story.isPublished ? 'Published' : 'Unpublished' }}
            </v-chip></v-card-title>
          <v-spacer></v-spacer>
          <v-btn size="large"></v-btn>
          <v-btn v-if="!isFavoriteStory" size="large" color="grey" icon="mdi-heart" @click="addFavorite" />
          <v-btn v-if="isFavoriteStory" size="large" color="primary" icon="mdi-heart" @click="removeFavorite" />

        </v-card-actions>


        <v-card-text>{{ story.story }}</v-card-text>

      </v-card>
    </div>
  </v-container>
</template>
