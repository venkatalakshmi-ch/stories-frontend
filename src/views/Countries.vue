<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CountriesService from "../services/CountriesService";

const router = useRouter();


const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const countries = ref([]);

const country = ref({
  name: "",
  description: ""
});

const dialog = ref(false);

const selectedCountry = ref({});

const openEditDialog = async (lang) => {
  selectedCountry.value = lang;
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

  await getCountries();
});

async function getCountries() {
  CountriesService.getCountries()
    .then((response) => {
      countries.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

function createCountry() {

  if (country.value.name === "" || country.value.description === "") {
    snackbar.value.color = "red";
    snackbar.value.text = "Please fill all fields";
    snackbar.value.value = true;
    return;
  }

  CountriesService.createCountry(country.value)
    .then((response) => {
      getCountries();
      snackbar.value.color = "green";
      snackbar.value.text = "Country created successfully";
      snackbar.value.value = true;

      country.value.name = "";
      country.value.description = "";
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error creating country";
      snackbar.value.value = true;
      console.log(e);
    });
}

function updateCountry() {
  CountriesService.updateCountry(selectedCountry.value)
    .then((response) => {
      getCountries();
      snackbar.value.color = "green";
      snackbar.value.text = "Country updated successfully";
      snackbar.value.value = true;

      selectedCountry.value = {};

      closeDialog();
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error updating country";
      snackbar.value.value = true;
      console.log(e);
    });
}

function onDeleteCountry(country) {
  CountriesService.deleteCountry(country.id)
    .then((response) => {
      getCountries();
      snackbar.value.color = "green";
      snackbar.value.text = "Country deleted successfully";
      snackbar.value.value = true;
    })
    .catch((e) => {
      snackbar.value.color = "red";
      snackbar.value.text = "Error deleting country";
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
      <v-card-title class="headline mb-2">Countries </v-card-title>

      <v-card-text>
        <v-text-field v-model="country.name" label="Title" required>
        </v-text-field>
        <v-text-field v-model="country.description" label="Description" required>
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="createCountry()">Create country</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>


  <v-container>
    <v-card-title class="headline mb-2">Available countries </v-card-title>

    <div v-for="lang in countries" :key="lang.id">
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

              <v-btn icon @click="onDeleteCountry(lang)">
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
        <v-card-title class="headline">Edit country</v-card-title>
        <v-card-text>
          <v-text-field v-model="selectedCountry.name" label="Title" required>
          </v-text-field>
          <v-text-field v-model="selectedCountry.description" label="Description" required>
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" @click="closeDialog()">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="updateCountry()">Update country</v-btn>
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
