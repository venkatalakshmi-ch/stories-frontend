import apiClient from "./services";


export default {

  getCountries() {
    return apiClient.get("countries");
  },
  getCountry(id) {
    return apiClient.get(`countries/${id}`);
  },
  createCountry(country) {
    return apiClient.post("countries", country);
  },
  updateCountry(country) {
    return apiClient.put(`countries/${country.id}`, country);
  },
  deleteCountry(id) {
    return apiClient.delete(`countries/${id}`);
  },
  
};
