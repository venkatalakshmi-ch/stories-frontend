<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const user = ref({});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

const password = ref({
  newPassword: "",
  confirmPassword: "",
});


async function changePassword() {
  if (password.value.newPassword === "" || password.value.confirmPassword === "") {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Please fill in all fields";
    return;
  }
  if (password.value.newPassword !== password.value.confirmPassword) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Passwords do not match";
    return;
  }

  try {
    const response = await UserServices.changePassword(user.value.id, password.value.newPassword);
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = "Password changed successfully";
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Failed to change password";
  }
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">

      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Change Password</v-card-title>
        <v-card-text>
          <v-text-field type="password" v-model="password.newPassword" label="New Password" required></v-text-field>

          <v-text-field type="password" v-model="password.confirmPassword" label="Confirm Password" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn variant="flat" color="primary" @click="changePassword()">Change Password</v-btn>
        </v-card-actions>
      </v-card>

      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
