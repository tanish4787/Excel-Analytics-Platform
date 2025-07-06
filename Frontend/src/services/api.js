import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

export const uploadExcelFile = (formData) =>
  API.post("/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...authHeader().headers,
    },
  });

export const getUserUploads = () => API.get("/uploads/all", authHeader());

export const getSingleUpload = (id) => API.get(`/uploads/${id}`, authHeader());

export const downloadExcel = (id) =>
  `${API.defaults.baseURL}/uploads/download/excel/${id}`;

export const downloadJson = (id) =>
  `${API.defaults.baseURL}/uploads/download/json/${id}`;

export const saveAnalysis = (id, payload) =>
  API.post(`/uploads/analysis/${id}`, payload, authHeader());

export const getAnalysisSessions = (id) =>
  API.get(`/uploads/analysis/${id}`, authHeader());

export default API;
