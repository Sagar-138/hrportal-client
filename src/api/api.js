import axios from 'axios';

const API_URL = "https://hrportal-server.onrender.com/api";
const API = axios.create({ baseURL: API_URL });

// Vacancy APIs
export const createVacancy = (data) => API.post("/vacancies", data);
export const getVacancies = () => API.get("/vacancies");
export const deleteVacancy = (id) => API.delete(`/vacancies/${id}`);

// Candidate APIs
export const addCandidate = async (data) => {
  console.log("Sending FormData:", Object.fromEntries(data.entries()));
    return await API.post("/candidates", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
};
export const getCandidates = () => API.get("/candidates");
export const getCandidate = (id) => API.get(`/candidates/${id}`);
export const deleteCandidate = (candidateId) => API.delete(`/candidates/${candidateId}`);
// Marks APIs
export const addMarks = async (candidateId, data) => {
    return await API.patch(`/candidates/${candidateId}/marks`, data);
};

// Interview APIs
export const scheduleInterview = (data) => API.post("/interviews", data);

// Offer Letter APIs
export const getEligibleCandidates = () => API.get("/offer-letters/eligible-candidates");


export const generateOfferLetter = (data) => 
  API.post("/offer-letters/generate", data, {
      headers: {
          'Content-Type': 'application/json'
      }
  });

  export const previewOfferLetter = (offerId) => API.get(`/offer-letters/preview/${offerId}`);
export const downloadOfferLetter = (offerId) => API.get(`/offer-letters/download/${offerId}`);