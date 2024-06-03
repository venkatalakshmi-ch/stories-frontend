import apiClient from "./services";


export default {

  getLanguages() {
    return apiClient.get("languages");
  },
  getLanguage(id) {
    return apiClient.get(`languages/${id}`);
  },
  createLanguage(language) {
    return apiClient.post("languages", language);
  },
  updateLanguage(language) {
    return apiClient.put(`languages/${language.id}`, language);
  },
  deleteLanguage(id) {
    return apiClient.delete(`languages/${id}`);
  },
  
};
