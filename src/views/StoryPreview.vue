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
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to get story";
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
        <v-card-title>{{ story.title }} <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-account-circle-outline"></v-icon>
            {{ story.user.firstName }} {{ story.user.lastName }}
          </v-chip>
          <v-chip class="ma-2" :color="story.isPublished ? 'green' : 'red'" label>
            <v-icon start icon="mdi-check-circle-outline"></v-icon>
            {{ story.isPublished ? 'Published' : 'Unpublished' }}
          </v-chip></v-card-title>
        <v-card-text>{{ story.story }}</v-card-text>
        
      </v-card>
    </div>
  </v-container>
</template>
