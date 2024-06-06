<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
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
  await getStories();
}
);

const stories = ref([]);

async function getStories() {
  try {
    const response = await ChatService.getStories();
    stories.value = response.data;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to get stories";
  }
}

async function previewStory(story) {
  router.push({ name: "preview", params: { id: story.id } });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" v-for="story in stories" :key="story.id">
        <v-card @click="previewStory(story)">
          <v-card-title>{{ story.title }} <v-chip class="ma-2" color="primary" label>
              <v-icon start icon="mdi-account-circle-outline"></v-icon>
              {{ story.user.firstName }} {{ story.user.lastName }}
            </v-chip>
            <v-chip class="ma-2" :color="story.isPublished ? 'green' : 'red'" label>
              <v-icon start icon="mdi-check-circle-outline"></v-icon>
              {{ story.isPublished ? 'Published' : 'Unpublished' }}
            </v-chip></v-card-title>
          <v-card-text>
            {{ story.story }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
