<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import LangugeService from "../services/LanguageService";


const router = useRouter();


const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const languages = ref([]);

const language = ref({
  name: "",
  description: ""
});

const dialog = ref(false);

const selectedLanguage = ref({});

const openEditDialog = async (lang) => {

  selectedLanguage.value = lang;
  dialog.value = true;

};


const user = ref({});

onMounted(async () => {
  // localStorage.removeItem("user");
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  }
  else {
    router.push({ name: "login" });
  }

  getLanguages();
});

function getLanguages() {
  LangugeService.getLanguages()
    .then((response) => {
      languages.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}


function createLanguage() {

  if(language.value.name === "" || language.value.description === "") {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }
  
  LangugeService.createLanguage(language.value)
    .then((response) => {
      getLanguages();
      snackbar.value.color = "green";
      snackbar.value.text = "Language created successfully";
      snackbar.value.value = true;

      language.value.name = "";
      language.value.description = "";

    })
    .catch((e) => {

      snackbar.value.color = "red";
      snackbar.value.text = "Error creating language";
      snackbar.value.value = true;
      console.log(e);
    });
}



function updateLanguage() {

  if(selectedLanguage.value.name === "" || selectedLanguage.value.description === "") {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }



  LangugeService.updateLanguage(selectedLanguage.value)
    .then((response) => {
      getLanguages();
      snackbar.value.color = "green";
      snackbar.value.text = "Language updated successfully";
      snackbar.value.value = true;

      selectedLanguage.value.name = "";
      selectedLanguage.value.description = "";

      dialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error updating language";
      snackbar.value.value = true;
      console.log(e);
    });
}


function onDeleteLanguage(lang) {

  // add confirmation
  if (!confirm("Are you sure you want to delete this language?")) {
    return;
  }

  LangugeService.deleteLanguage(lang.id)
    .then((response) => {
      getLanguages();
      snackbar.value.color = "green";
      snackbar.value.text = "Language deleted successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error deleting language";
      snackbar.value.value = true;
      console.log(e);
    });
}

function closeDialog() {
  dialog.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}



</script>

<template>

  <v-container>
    <v-card class="rounded-lg elevation-5">
      <v-card-title class="headline mb-2">Languages </v-card-title>

      <v-card-text>
        <v-text-field v-model="language.name" label="Title" required>
        </v-text-field>
        <v-text-field v-model="language.description" label="Description" required>
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="createLanguage()">Create language</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>


  <v-container>
    <v-card-title class="headline mb-2">Available Languages </v-card-title>

    <div v-for="lang in languages" :key="lang.id">
      <v-card class="mb-2">
        <v-card-title>
          <v-row>
            <v-col cols="10">
              <span class="headline">{{ lang.id }}. {{ lang.name }}</span>
            </v-col>
            <v-col cols="2">
              <v-btn icon class="mx-2" @click="openEditDialog(lang)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn icon @click="onDeleteLanguage(lang)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <span>{{ lang.description }}</span>
        </v-card-text>
      </v-card>
    </div>
  </v-container>

  <template v-if="dialog">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Edit Language</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedLanguage.name" label="Title" required>
          </v-text-field>
          <v-text-field v-model="selectedLanguage.description" label="Description" required>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat"  @click="closeDialog()">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="updateLanguage()">Update language</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>

  <v-snackbar v-model="snackbar.value" rounded="pill">
    {{ snackbar.text }}

    <template v-slot:actions>
      <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
