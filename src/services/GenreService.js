import apiClient from "./services";


export default {

  getGenres() {
    return apiClient.get("genres");
  },
  getGenre(id) {
    return apiClient.get(`genres/${id}`);
  },
  createGenre(genre) {
    return apiClient.post("genres", genre);
  },
  updateGenre(genre) {
    return apiClient.put(`genres/${genre.id}`, genre);
  },
  deleteGenre(id) {
    return apiClient.delete(`genres/${id}`);
  },
  
};
