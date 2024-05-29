<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import ChatServices from "../services/ChatServices";
import StoryCard from "../components/StoryCard.vue";
const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const chat = ref({
  message: "",
  storyId: 1,
});

const stories = ref([]);

const story = ref({
  title: "",
  story: "",
  userId: 1,
  isPublished: false,
});

const chatHistory = ref([]);
const selectedStory = ref(null);


const storyDialog = ref(false);

const openEditDialog = async (story) => {
  selectedStory.value = story;
  await getChatHistory();
  storyDialog.value = true;
};

function closeStoryDialog() {
  storyDialog.value = false;
}


async function getChatHistory() {
  await ChatServices.getChatHistory(selectedStory.value.id)
    .then((response) => {
      chatHistory.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}


async function createStory() {
  story.value.userId = user.value.id;
  await ChatServices.createStory(story.value)
    .then(async () => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story created successfully!";
      await getStories();
      const story = ref({
        title: "",
        story: "",
        userId: 1,
        isPublished: false,
      });
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
    if (user.value.type === "admin") {
      router.push({ name: "admin-home" });
    }
    else {
      router.push({ name: "user-home" });
    }
  }

  await getStories();
});


async function sendMesage() {
  console.log(chat.value);
  chat.value.storyId = selectedStory.value.id;
  await ChatServices.sendChatMessage(chat.value)
    .then(async () => {
      await getChatHistory();
      chat.value.message = "";
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Message sent successfully!";
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
      <v-col cols="12" md="6" v-for="story in stories" :key="story.id">
        <StoryCard :story="story" @edit-story="openEditDialog" />
      </v-col>
    </v-row>
  </v-container>


  <v-dialog persistent v-model="storyDialog" max-width="1200">
    <v-container>
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mx-2 my-2">
          <v-row align="center" justify="space-between">
            <span>Cohere AI</span>
            <v-icon @click="closeStoryDialog">mdi-close</v-icon>
          </v-row>
        </v-card-title>

        <v-card-text class="chat-container">
          <div v-for="(chat, index) in chatHistory" :key="index" class="chat-message"
            :class="{ 'user-message': chat.role === 'User', 'chatbot-message': chat.role === 'Chatbot' }">
            <p>{{ chat.message }}</p>

            <v-card-actions v-if="chat.role === 'Chatbot'">
              <v-spacer></v-spacer>
              <v-btn class="publish-button" small @click="publishMessage(chat.message)">
                Publish
              </v-btn> </v-card-actions>
          </div>

        </v-card-text>


        <v-card-text>
          <v-text-field v-model="chat.message" label="Message" required>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="sendMesage()">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </v-dialog>


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
.chat-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.chat-message {
  max-width: 70%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
}

.user-message {
  align-self: flex-end;
  background-color: #DCF8C6;
  /* Light green */
}

.chatbot-message {
  align-self: flex-start;
  background-color: #E0E0E0;
  /* Light grey */
}

.publish-button {
  background-color: #4CAF50;
  /* Green */
  border: none;
  color: white;
  padding: 10px 24px;
  cursor: pointer;
  border-radius: 5px;
}


.v-dialog {
  overflow: hidden;
}
</style>