import apiClient from "./services";


export default {
  sendChatMessage(message) {
    return apiClient.post("chat", message);
  },

  createStory(story) {
    return apiClient.post("stories", story);
  },

  getStories() {
    return apiClient.get("stories");
  },

  getChatHistory(storyId) {
    return apiClient.get(`chat/story/${storyId}`);
  }

};
