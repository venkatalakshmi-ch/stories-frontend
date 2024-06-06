<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from "vue";
import { defineProps, defineEmits, computed } from 'vue';

const router = useRouter();
const showDetails = ref(false);
const user = ref(null);

const props = defineProps({
    story: {
        required: true,
    },
});

const emit = defineEmits(['edit-story']);

onMounted(async () => {
    user.value = JSON.parse(localStorage.getItem('user'));
});

function handleEditClick(event) {
    event.stopPropagation();
    emit('edit-story', props.story);
}
const isAdmin = computed(() => user.value !== null && user.value.type === 'admin');

function handleDelete(event) {
    event.stopPropagation();
    emit('delete-story', props.story);
}


</script>

<template>
    <v-card class="rounded-lg elevation-5 mb-1" @click="showDetails = !showDetails">
        <v-card-title class="headline">
            <v-row align="center">
                <v-col cols="10">
                    {{ story.title }}
                    <v-chip class="ma-2" color="primary" label>
                        <v-icon start icon="mdi-account-circle-outline"></v-icon>
                        {{ story.user.firstName }} {{ story.user.lastName }}
                    </v-chip>
                    <v-chip class="ma-2" :color="story.isPublished ? 'green' : 'red'" label>
                        <v-icon start icon="mdi-check-circle-outline"></v-icon>
                        {{ story.isPublished ? 'Published' : 'Unpublished' }}
                    </v-chip>
                </v-col>
                <v-col class="d-flex justify-end">
                    <v-icon v-if="isAdmin" size="small" icon="mdi-delete" @click="handleDelete" ></v-icon>
                </v-col>
                <v-col class="d-flex justify-end">
                    <v-icon v-if="isAdmin" size="small" icon="mdi-pencil" @click="handleEditClick" ></v-icon>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text class="body-1">
            {{ story.content }}
        </v-card-text>
        <v-expand-transition>
            <v-card-text class="pt-0" v-show="showDetails">
                <p>{{ story.story }}</p>
            </v-card-text>
        </v-expand-transition>
    </v-card>
</template>

<style scoped>
.v-card {
    cursor: pointer;
}
</style>
