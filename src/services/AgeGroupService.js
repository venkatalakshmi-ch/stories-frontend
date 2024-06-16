import apiClient from "./services";


export default {
  
    getAgeGroups() {
      return apiClient.get("age_groups");
    },
    getAgeGroup(id) {
      return apiClient.get(`age_groups/${id}`);
    },
    createAgeGroup(age_group) {
      return apiClient.post("age_groups", age_group);
    },
    updateAgeGroup(age_group) {
      return apiClient.put(`age_groups/${age_group.id}`, age_group);
    },
    deleteAgeGroup(id) {
      return apiClient.delete(`age_groups/${id}`);
    },
    
  };