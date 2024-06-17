<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import AgeGroupService from "../services/AgeGroupService";

// Agegroup has from, to, description fields

const router = useRouter();


const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const agegroup = ref({
  from: "",
  to: "",
  description: "",
});

const agegroups = ref([]);

const dialog = ref(false);

const selectedAgeGroup = ref({});

const openEditDialog = async (agegroup) => {
  selectedAgeGroup.value = agegroup;
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

  getAgeGroups();
});

function getAgeGroups() {
  AgeGroupService.getAgeGroups()
    .then((response) => {
      agegroups.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

function createAgeGroup() {

  agegroup.value.description = `Age Group ${agegroup.value.from} - ${agegroup.value.to}`;

  AgeGroupService.createAgeGroup(agegroup.value)
    .then((response) => {
      snackbar.value = {
        value: true,
        color: "success",
        text: "Age group created successfully",
      };
      getAgeGroups();
    })
    .catch((e) => {
      console.log(e);
      snackbar.value = {
        value: true,
        color: "error",
        text: "Error creating age group",
      };
    });
}


function updateAgeGroup() {

  selectedAgeGroup.value.description = `Age Group ${selectedAgeGroup.value.from} - ${selectedAgeGroup.value.to}`;
  
  AgeGroupService.updateAgeGroup(selectedAgeGroup.value)
    .then((response) => {
      snackbar.value = {
        value: true,
        color: "success",
        text: "Age group updated successfully",
      };
      getAgeGroups();
      closeDialog();
    })
    .catch((e) => {
      console.log(e);
      snackbar.value = {
        value: true,
        color: "error",
        text: "Error updating age group",
      };
    });
}


function onDeleteAgeGroup(agegroup) {
  AgeGroupService.deleteAgeGroup(agegroup.id)
    .then((response) => {
      snackbar.value = {
        value: true,
        color: "success",
        text: "Age group deleted successfully",
      };
      getAgeGroups();
    })
    .catch((e) => {
      console.log(e);
      snackbar.value = {
        value: true,
        color: "error",
        text: "Error deleting age group",
      };
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
      <v-card-title class="headline mb-2">Age group </v-card-title>

      <v-card-text>
        
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="agegroup.from" label="From" type="number" required></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="agegroup.to" label="To" type="number" required></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="createAgeGroup()">Create age group</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>


  <v-container>
    <v-card-title class="headline mb-2">Available Age Groups </v-card-title>

    <div v-for="agegroup in agegroups" :key="agegroup.id">
      <v-card class="mb-2">
        <v-card-title>
          <v-row>
            <v-col cols="10">
              <span class="headline">{{ agegroup.id }}. {{ agegroup.from }} - {{ agegroup.to }}</span>
            </v-col>
            <v-col cols="2">
              <v-btn  class="mx-2" color="grey" size="large" icon="mdi-pencil" @click="openEditDialog(agegroup)"/>

              <v-btn icon="mdi-delete" color="grey" size="large" @click="onDeleteAgeGroup(agegroup)"/>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <span>{{ agegroup.description }}</span>
        </v-card-text>
      </v-card>
      </div>
    </v-container>


  <template v-if="dialog">
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Edit Age Group</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field v-model="selectedAgeGroup.from" label="From" type="number" required></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="selectedAgeGroup.to" label="To" type="number" required></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="updateAgeGroup()">Update age group</v-btn>
          <v-btn variant="flat" color="error" @click="closeDialog()">Cancel</v-btn>
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
