<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ChatServices from "../services/ChatServices";
import StoryCard from "../components/StoryCard.vue";
const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


const stories = ref([]);

const story = ref({
  title: "",
  story: "",
  userId: 1,
  isPublished: false,
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
});

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

function closeSnackBar() {
  snackbar.value.value = false;
}



</script>

<template>

  <v-container>
    <v-card class="rounded-lg elevation-5">
      <v-card-title class="headline mb-2">Stories </v-card-title>

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
    <v-row>
      <v-col cols="12" v-for="story in stories" :key="story.id">
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
