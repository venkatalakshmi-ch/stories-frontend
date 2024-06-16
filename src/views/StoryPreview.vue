<script setup>
import { onMounted } from "vue";
import { ref, toRaw, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import ChatService from "../services/ChatServices.js";

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const user = ref({});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
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
    await getFeedbacks();
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

const feedback = ref({
  message: "",
  userId: null,
  storyId: null,
});

const feedbacks = ref([]);


async function addFeedback() {
  if (feedback.value.message === "") {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Feedback message cannot be empty";
    return;
  }

  feedback.value.userId = user.value.id;
  feedback.value.storyId = story.value.id;
  try {
    await ChatService.addFeedback(feedback.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = "Feedback added";
    feedback.value.message = "";
    await getFeedbacks();
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to add feedback";
  }
}

async function deleteFeedback(feed) {
  try {
    await ChatService.removeFeedback(feed);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = "Feedback deleted";
    await getFeedbacks();
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to delete feedback";
  }
}


async function getFeedbacks() {
  try {
    const response = await ChatService.getFeedbacks(story.value.id);
    feedbacks.value = response.data;
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to get feedbacks";
  }
}

const selectedFeedback = ref(null);

const openEditDialog = ref(false);

function editFeedback(feed) {
  selectedFeedback.value = feed;
  openEditDialog.value = true;
}

function closeFeedbackDialog() {
  openEditDialog.value = false;
}


async function saveFeedback() {

  if (selectedFeedback.value.message === "") {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Feedback message cannot be empty";
    return;
  }
  try {
    await ChatService.editFeedback(selectedFeedback.value);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = "Feedback updated";
    closeFeedbackDialog();
    await getFeedbacks();
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to update feedback";
  }
}

async function onDeleteStory() {
  // confirm dialog
  if (!confirm("Are you sure you want to delete this story?")) {
    return;
  }
  await ChatService.deleteStory(story.value.id)
    .then(async () => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story deleted successfully!";
      router.go(-1);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

const editStory = async (story) => {
  router.push({ name: "edit-story", params: { id: story.id } });
};

const canEditStory = computed(() => user.value !== null && (user.value.id === story.value.userId) || user.value.type === "admin");


function closeSnackBar() {
  snackbar.value.value = false;
}

function dateFormatted(updatedAt) {
  const date = new Date(updatedAt);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
}

async function generatePDF() {
  const content = document.getElementById('pdf-area');

  try {
    const canvas = await html2canvas(content, { scale: 2 }); // Adjust scale as needed
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF();
    const imgWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    doc.save(`${story.value.title}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Handle errors gracefully (e.g., display error message to user)
  }
}


</script>

<template>
  <v-container>
    <div>
      <v-card v-if="story != null">
        <v-container id="pdf-area">
          <v-card-actions>
            <v-card-title>
              {{ story.title }}
            </v-card-title>
            <v-spacer></v-spacer>
            <div data-html2canvas-ignore="true">

            <v-btn v-if="canEditStory" size="large" class="mx-2" color="grey" icon="mdi-delete"
              @click="onDeleteStory"></v-btn>
            <v-btn v-if="canEditStory" size="large" class="mx-2" color="blue" icon="mdi-pencil"
              @click="editStory"></v-btn>

            <v-btn v-if="user !== null" size="large" color="green" icon="mdi-file-pdf-box"
              @click.stop="generatePDF()"></v-btn>

            <v-btn v-if="!isFavoriteStory" size="large" color="grey" icon="mdi-heart" @click="addFavorite" />

            <v-btn v-if="isFavoriteStory" size="large" color="pink" icon="mdi-heart" @click="removeFavorite" />
            </div>
          </v-card-actions>

          <v-card-title>
            <v-chip class="mx-2" color="primary" label>
              <v-icon start icon="mdi-account-circle-outline"></v-icon>
              {{ story.user.firstName }} {{ story.user.lastName }}
            </v-chip>
            <v-chip class="mx-2" :color="story.isPublished ? 'green' : 'red'" label>
              <v-icon start icon="mdi-check-circle-outline"></v-icon>
              {{ story.isPublished ? 'Published' : 'Unpublished' }}
            </v-chip>
            <v-chip class="mx-2" color="cyan" label>
              {{ story.genre.name }}
            </v-chip>
            <v-chip class="mx-2" color="cyan" label>
              {{ story.language.name }}
            </v-chip>
            <v-chip class="mx-2" color="blue" label>
              {{ story.country.name }}
            </v-chip>
          </v-card-title>



          <v-card-text class="ma-2" style="font-size:medium; font-weight: bold; color: grey; text-align: justify;">
            {{ story.story }}

            <v-card-actions>
              <v-spacer></v-spacer>
              <span class="grey--text" style="font-weight: bold; font-size:8; font-style: italic; ">
                {{ dateFormatted(story.updatedAt) }}
              </span>
            </v-card-actions>
          </v-card-text>
        </v-container>

        <v-card-text>

          <v-divider class="my-3"></v-divider>
          <v-card-title v-if="feedbacks.length > 0">Feedbacks</v-card-title>
          <v-list v-if="feedbacks.length > 0">
            <v-list-item class="my-3" v-for="item in feedbacks" :key="item.id">
              <v-list-item-title>
                <v-row>
                  <v-col cols="10">
                    {{ item.message }}
                  </v-col>
                  <v-col align="right" v-if="user.id === item.user.id" cols="2">
                    <v-icon class="mx-4" @click="editFeedback(item)" color="grey">mdi-pencil</v-icon>
                    <v-icon @click="deleteFeedback(item)" color="grey">mdi-delete</v-icon>
                  </v-col>
                </v-row>
              </v-list-item-title>
              <br>

              <v-list-item-subtitle>
                <v-row align="center">
                  <v-col cols="9">
                    <v-chip color="black" label>
                      <v-icon start icon="mdi-account-circle-outline"></v-icon>
                      {{ item.user.firstName }} {{ item.user.lastName }}
                    </v-chip>
                  </v-col>
                  <v-col align="right" cols="3">
                    <span class="grey--text" style="font-weight: normal; font-size:8; font-style: italic;">
                      {{ dateFormatted(item.updatedAt) }}
                    </span>
                  </v-col>
                </v-row>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-3"></v-divider>

          <v-text-field v-model="feedback.message" label="Add Feedback" outlined></v-text-field>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="addFeedback" color="primary">Add Feedback</v-btn>
          </v-card-actions>
        </v-card-text>

        <v-dialog v-model="openEditDialog" max-width="500px">
          <v-card>
            <v-card-title>Edit Feedback</v-card-title>
            <v-card-text>
              <v-text-field v-model="selectedFeedback.message" label="Feedback" outlined></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="flat" @click="closeFeedbackDialog">Cancel</v-btn>
              <v-btn variant="flat" @click="saveFeedback" color="primary">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card>
    </div>
  </v-container>
</template>


<style scoped>
.v-list-item {
  background-color: #e0ecd7;
  border-radius: 10px;
  padding: 10px;
}
</style>