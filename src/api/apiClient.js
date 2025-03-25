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
export const fetchProjects = () => apiClient1.get("/game");
export const fetchProjectDetails = (id) => apiClient1.get(`/game/${id}`);
export const fetchGames = () => apiClient.get("/projects");
export const fetchGameDetails = (id) => apiClient.get(`/projects/${id}`);
export const createProject = (data) => apiClient.post("/project", data);
// Add a new board to a project
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
