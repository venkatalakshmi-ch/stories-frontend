<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import UserServices from "../services/UserServices.js";

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


const user = ref({});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    user.value = JSON.parse(localStorage.getItem("user"));
  }
  else {
    router.push({ name: "login" });
  }
});

function closeSnackBar() {
  snackbar.value.value = false;
}



function updateAccount() {
  UserServices.updateUser(user.value)
    .then(() => {

      localStorage.setItem("user", JSON.stringify(user.value));
      user.value = JSON.parse(localStorage.getItem("user"));

      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Profile updated successfully!";
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
      <v-card-title class="headline mb-2">Update profile </v-card-title>
      <v-card-text>

        <v-text-field v-model="user.firstName" label="First Name" required></v-text-field>

        <v-text-field v-model="user.lastName" label="Last Name" required></v-text-field>

        <v-text-field v-model="user.email" label="Email" required></v-text-field>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="updateAccount()">Update profile</v-btn>
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
