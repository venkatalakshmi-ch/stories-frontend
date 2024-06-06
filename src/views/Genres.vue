<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import GenreService from "../services/GenreService";


const router = useRouter();


const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const genres = ref([]);

const genre = ref({
  name: "",
  description: ""
});

const dialog = ref(false);

const selectedGenre = ref({});

const openEditDialog = async (lang) => {

  selectedGenre.value = lang;
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

  getGenres();
});

function getGenres() {
  GenreService.getGenres()
    .then((response) => {
      genres.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}


function createGenre() {

  if(genre.value.name === "" || genre.value.description === "") {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }
  
  GenreService.createGenre(genre.value)
    .then((response) => {
      getGenres();
      snackbar.value.color = "green";
      snackbar.value.text = "Genre created successfully";
      snackbar.value.value = true;

      genre.value.name = "";
      genre.value.description = "";

    })
    .catch((e) => {

      snackbar.value.color = "red";
      snackbar.value.text = "Error creating genre";
      snackbar.value.value = true;
      console.log(e);
    });
}



function updateGenre() {

  if(selectedGenre.value.name === "" || selectedGenre.value.description === "") {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }



  GenreService.updateGenre(selectedGenre.value)
    .then((response) => {
      getGenres();
      snackbar.value.color = "green";
      snackbar.value.text = "Genre updated successfully";
      snackbar.value.value = true;

      selectedGenre.value.name = "";
      selectedGenre.value.description = "";

      dialog.value = false;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error updating genre";
      snackbar.value.value = true;
      console.log(e);
    });
}


function onDeleteGenre(lang) {

  // add confirmation
  if (!confirm("Are you sure you want to delete this genre?")) {
    return;
  }

  GenreService.deleteGenre(lang.id)
    .then((response) => {
      getGenres();
      snackbar.value.color = "green";
      snackbar.value.text = "Genre deleted successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error deleting genre";
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
      <v-card-title class="headline mb-2">Genres </v-card-title>

      <v-card-text>
        <v-text-field v-model="genre.name" label="Title" required>
        </v-text-field>
        <v-text-field v-model="genre.description" label="Description" required>
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="createGenre()">Create genre</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>


  <v-container>
    <v-card-title class="headline mb-2">Available Genres </v-card-title>

    <div v-for="lang in genres" :key="lang.id">
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

              <v-btn icon @click="onDeleteGenre(lang)">
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
        <v-card-title class="headline">Edit Genre</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedGenre.name" label="Title" required>
          </v-text-field>
          <v-text-field v-model="selectedGenre.description" label="Description" required>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat"  @click="closeDialog()">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="updateGenre()">Update genre</v-btn>
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
