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
  },
  getStory(id) {
    return apiClient.get(`stories/${id}`);
  },
  updateStory(story) {
    return apiClient.put(`stories/${story.id}`, story);
  },
  deleteStory(id) {
    return apiClient.delete(`stories/${id}`);
  },

  addFavoriteStory(storyId, userId) {
    return apiClient.post(`stories/addFavorite/${storyId}/${userId}`);
  },

  removeFavoriteStory(storyId, userId) {
    return apiClient.delete(`stories/removeFavorite/${storyId}/${userId}`);
  },

  isFavoriteStory(storyId, userId) {
    return apiClient.get(`stories/isFavorite/${storyId}/${userId}`);
  },

  addFeedback(feedback) {
    return apiClient.post(`stories/addFeedback/${feedback.storyId}/${feedback.userId}`, feedback);
  },

  removeFeedback(feedback) {
    console.log(feedback);
    return apiClient.delete(`stories/removeFeedback/${feedback.id}`);
  },

  editFeedback(feedback) {
    return apiClient.put(`stories/editFeedback/${feedback.id}`, feedback);
  },

  getFeedbacks(storyId) {
    return apiClient.get(`stories/feedbacks/${storyId}`);
  },

  // get all stories by a user
  getStoriesByUser(userId) {
    return apiClient.get(`stories/user/${userId}`);
  },

  // get all published stories by a user
  getPublishedStoriesByUser(userId) {
    return apiClient.get(`stories/published/${userId}`);
  },

  // get all favorite stories by a user
  getFavoriteStoriesByUser(userId) {
    return apiClient.get(`stories/favorite/${userId}`);
  },

  // get all published stories
  getPublishedStories() {
    return apiClient.get("stories/published");
  },

  // get favorite stories by a user
  getFavoriteStoriesByUser(userId) {
    return apiClient.get(`stories/favorite/${userId}`);
  },


};
