import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://6656dd4e9f970b3b36c6e348.mockapi.io", // Thay bằng URL API của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchProjects = () => apiClient.get("/projects");
export const fetchProjectDetails = (id) => apiClient.get(`/projects/${id}`);
export const createProject = (data) => apiClient.post("/project", data);

export default apiClient;
