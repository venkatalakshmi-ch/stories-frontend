<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from "vue";
import { defineProps, defineEmits, computed } from 'vue';

const router = useRouter();
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

function showPreview(story) {
    router.push({ name: 'preview', params: { id: story.id } });
}

</script>

<template>
    <v-card @click="showPreview(story)" class="rounded-lg elevation-5 mb-1">
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
                    <v-chip class="ma-2" color="blue" label>
                        {{ story.genre.name }}
                    </v-chip>
                    <v-chip class="ma-2" color="blue" label>
                        {{ story.language.name }}
                    </v-chip>
                    <v-chip class="ma-2" color="blue" label>
                        {{ story.country.name }}
                    </v-chip>
                    <v-chip class="ma-2" color="blue" label>
                        {{ story.ageGroup.description }}
                    </v-chip>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text class="body-1" style="font-weight: bold; color: grey; text-align: justify;">
            {{ story.story }}

            <v-card-actions>
                <v-spacer></v-spacer>
                <span class="grey--text" style="font-weight: bold; font-size:8; font-style: italic;">
                    {{ dateFormatted(story.updatedAt) }}
                </span>
            </v-card-actions>
        </v-card-text>
    </v-card>
</template>

<style scoped>
.v-card {
    cursor: pointer;
}
</style>
