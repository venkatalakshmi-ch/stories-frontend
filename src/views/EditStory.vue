<script setup>


import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import ChatServices from "../services/ChatServices";
const router = useRouter();
const route = useRoute();
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

const chat = ref({
    message: "",
    storyId: 1,
});


const chatHistory = ref([]);
const selectedStory = ref(null);


const user = ref({});

onMounted(async () => {
    // localStorage.removeItem("user");
    if (localStorage.getItem("user") !== null) {
        user.value = JSON.parse(localStorage.getItem("user"));
    }


    // Get the story id from the URL
    const id = route.params.id;
    console.log(route);
    await getStory(id);
    await getChatHistory();
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
});


async function getStory(id) {
    await ChatServices.getStory(id)
        .then((response) => {
            selectedStory.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

const showLoader = ref(false);


async function sendMesage() {

    showLoader.value = true;
    console.log(chat.value);
    chat.value.storyId = selectedStory.value.id;
    let message = chat.value.message;

    message = message + " Genre: " + selectedStory.value.genre.name + ".";
    message = message + " Country: " + selectedStory.value.country.name+ ".";
    message = message + " Language: " + selectedStory.value.language.name+ ".";

    chat.value.message = message;

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




async function getChatHistory() {
    await ChatServices.getChatHistory(router.currentRoute.value.params.id)
        .then((response) => {
            showLoader.value = false;
            chatHistory.value = response.data;
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}


async function publishStory(story) {
    selectedStory.value.story = story;
    selectedStory.value.isPublished = true;
    await ChatServices.updateStory(selectedStory.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Story published successfully!";
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

</script>



<template>
    <v-container>
        <v-card class="rounded-lg elevation-5">
            <v-card-title class="headline mx-2 my-2">
                <v-row align="center" justify="space-between">
                    <span>Cohere AI</span>
                </v-row>
            </v-card-title>

            <v-card-text class="chat-container">
                <div v-for="(chat, index) in chatHistory" :key="index" class="chat-message"
                    :class="{ 'user-message': chat.role === 'User', 'chatbot-message': chat.role === 'Chatbot' }">
                    <p>{{ chat.message }}</p>

                    <v-card-actions v-if="chat.role === 'Chatbot'">
                        <v-spacer></v-spacer>
                        <v-btn class="publish-button" small @click="publishStory(chat.message)">
                            Add to story
                        </v-btn>
                    </v-card-actions>
                </div>
            </v-card-text>

            <v-card-text>
                <v-text-field v-model="chat.message" label="Message" required></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-progress-circular v-if="showLoader" color="primary" indeterminate :size="20" :width="2"></v-progress-circular>
                <v-btn v-else variant="flat" color="primary" @click="sendMesage">Send</v-btn>
            </v-card-actions>
        </v-card>
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