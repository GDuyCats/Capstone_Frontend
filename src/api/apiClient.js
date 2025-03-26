import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://6656dd4e9f970b3b36c6e348.mockapi.io",
  headers: {
    "Content-Type": "application/json",
  },
});
const apiClient1 = axios.create({
  baseURL: "https://67b02665dffcd88a67887a70.mockapi.io/",
  headers: {
    "Content-Type": "application/json",
  },
});
const apiBase = axios.create({
  baseURL: "https://marvelous-gentleness-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});
export const apiAuth = axios.create({
  baseURL: "https://marvelous-gentleness-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});
apiAuth.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchProjects = () => apiBase.get("/api/Project/GetAllProject");
export const fetchProject = (id) =>
  apiBase.get(`/api/Project/GetProjectById?id=${id}`);
export const createProject = (data) =>
  apiAuth.post("/api/Project/CreateProject", data);
export const registerUser = (data) =>
  apiBase.post("/api/Authentication/register", data);
export const login = (data) => apiBase.post("/api/Authentication/login", data);
export const getComment = (data) => apiBase.get("/api/Comment", data);
// apiClient.js
export const updateThumbnail = (projectId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiAuth.put(
    `/api/Project/UpdateProjectThumbnail?projectId=${projectId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const updateStory = (projectId, story) => {
  return apiAuth.put(
    `/api/Project/UpdateProjectStory?projectId=${projectId}&story=${encodeURIComponent(
      story
    )}`,
    null
  );
};

// export const fetchProjects = () => apiClient1.get("/game");
export const fetchProjectDetails = (id) => apiClient1.get(`/game/${id}`);
export const updateProject = (id, data) =>
  axios.put(`/api/projects/${id}`, data);
export const deleteProject = (id) => axios.delete(`/api/projects/${id}`);
export const fetchGames = () => apiClient.get("/projects");
export const fetchGameDetails = (id) => apiClient.get(`/projects/${id}`); // Add a new board to a project
export const addBoardToProject = (projectId, boardData) =>
  apiClient.post(`/projects/${projectId}/boards`, boardData);

// Add a new card to a board
export const addCardToBoard = (projectId, boardId, cardData) =>
  apiClient.post(`/projects/${projectId}/boards/${boardId}/cards`, cardData);

// Add a member to a card
export const addMemberToCard = (projectId, boardId, cardId, memberId) =>
  apiClient.post(
    `/projects/${projectId}/boards/${boardId}/cards/${cardId}/members`,
    { memberId }
  );

// Add an attachment to a card
export const addAttachmentToCard = (
  projectId,
  boardId,
  cardId,
  attachmentData
) =>
  apiClient.post(
    `/projects/${projectId}/boards/${boardId}/cards/${cardId}/attachments`,
    attachmentData
  );

export default apiClient;
