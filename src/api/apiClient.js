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
export const createPaypalPayment = (projectId, amount) => {
  return apiAuth.post(
    `/api/PaypalPayment/create?projectId=${projectId}&amount=${amount}`
  );
};
export const executePaypalPayment = (paymentId, token, payerId) => {
  return apiAuth.get(`/api/PaypalPayment/execute`, {
    params: { paymentId, token, PayerID: payerId },
  });
};
export const fetchCreatorInfo = (userId) =>
  apiBase.get(`/api/User/GetUserByUserId?userId=${userId}`);
export const fetchRewardsByProjectId = (id) =>
  apiAuth.get(`/api/Reward/GetRewardByProjectId?projectId=${id}`);
export const fetchProjectsAdmin = () =>
  apiAuth.get("/api/Project/GetAllProjectByMonitor");
export const fetchUserProjects = () =>
  apiAuth.get("/api/Project/GetProjectByUserId");
export const deleteProject = (projectId) =>
  apiAuth.delete(`/api/Project/DeleteProject?id=${projectId}`);
export const staffApproveProject = ({ projectId, status, reason }) => {
  return apiAuth.put(`/api/Project/StaffApproveProject`, null, {
    params: { projectId, status, reason },
  });
};
export const fetchProjects = () => apiBase.get("/api/Project/GetAllProject");
export const fetchProject = (id) =>
  apiBase.get(`/api/Project/GetProjectById?id=${id}`);
export const createProject = (data) => {
  const formData = new FormData();
  formData.append("Title", data.Title);
  formData.append("Description", data.Description);
  formData.append("MinimumAmount", Number(data.MinimumAmount || 0).toString());
  formData.append("StartDatetime", data.StartDatetime);
  formData.append("EndDatetime", data.EndDatetime);

  return apiAuth.post("/api/Project/CreateProject", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const registerUser = (data) =>
  apiBase.post("/api/Authentication/register", data);
export const login = (data) => apiBase.post("/api/Authentication/login", data);
export const getComment = (data) => apiBase.get("/api/Comment", data);
export const updateProject = (id, data) => {
  const formData = new FormData();
  formData.append("Name", data.Name);
  formData.append("MinimumAmount", data.MinimumAmount);
  formData.append("Description", data.Description);
  formData.append("StartDatetime", data.StartDatetime);
  formData.append("EndDatetime", data.EndDatetime);

  return apiAuth.put(`/api/Project/UpdateProject?projectId=${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
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

export const addReward = (data) => apiAuth.post("/api/Reward/AddReward", data);

export const updateReward = (rewardId, data) => {
  const formData = new FormData();
  formData.append("Amount", data.amount);
  formData.append("Details", data.details);
  formData.append("CreatedDatetime", data["created-datetime"]);
  return apiAuth.put(
    `/api/Reward/UpdateReward?rewardId=${rewardId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const deleteReward = (rewardId) =>
  apiAuth.delete(`/api/Reward/DeleteReward?rewardId=${rewardId}`);
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("formFiles", file);

  return apiAuth.post("/api/File", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteFile = (fileId) =>
  apiAuth.delete(`/api/File/Remove?fileId=${fileId}`);

export const getUserFiles = (userId, page = 1, pageSize = 20) =>
  apiAuth.get(
    `/api/File/files/user/paging/${userId}?page=${page}&pageSize=${pageSize}`
  );

export const getFileById = (fileId) => apiAuth.get(`/api/File/file/${fileId}`);
export const fetchAllCategories = () =>
  apiAuth.get("/api/Category/GetAllCategory");

export const addCategoryToProject = (projectId, categoryId) => {
  const formData = new FormData();
  formData.append("ProjectId", projectId);
  formData.append("CategoryId", categoryId);

  return apiAuth.post("/api/Project/AddCategoryToProject", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchProjectCategories = (projectId) =>
  apiAuth.get(`/api/Category/GetAllCategoryByProjectId?projecId=${projectId}`);

export const removeCategoryFromProject = (projectId, categoryId) =>
  apiAuth.delete(
    `/api/Category/DeleteCategoryFromProject?projectId=${projectId}&categoryId=${categoryId}`
  );
export const fetchPledgesByUserId = () => {
  return apiAuth.get("/api/Pledge/GetPledgeByUserId");
};
// FAQ APIs
export const addFaq = (projectId, question, answer) => {
  const formData = new FormData();
  formData.append("Question", question);
  formData.append("Answer", answer);

  return apiAuth.post(`/api/Faq/AddFaq?projectId=${projectId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getFaqsByProjectId = (projectId) =>
  apiAuth.get(`/api/Faq/GetFaqByProjectId?projectId=${projectId}`);

export const updateFaq = (projectId, oldQuestion, newQuestion, answer) => {
  const formData = new FormData();
  formData.append("Question", newQuestion);
  formData.append("Answer", answer);

  return apiAuth.put(
    `/api/Faq/UpdateFaq?projectId=${projectId}&question=${encodeURIComponent(
      oldQuestion
    )}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const deleteFaq = (projectId, question) =>
  apiAuth.delete(
    `/api/Faq/DeleteFaq?projectId=${projectId}&question=${encodeURIComponent(
      question
    )}`
  );

export const createCollaborator = (email, projectId, role) => {
  const formData = new FormData();
  formData.append("Email", email);
  formData.append("ProjectId", projectId);
  formData.append("Role", role);

  return apiAuth.post("/api/Collaborator/CreateCollaboratorByEmail", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Get collaborators for a project
export const getProjectCollaborators = (projectId) => {
  return apiAuth.get(`/api/Collaborator/project?projectId=${projectId}`);
};

// Remove collaborator from project
export const removeCollaborator = (userId, projectId) => {
  return apiAuth.delete(
    `/api/Collaborator?userId=${userId}&projectId=${projectId}`
  );
};
export default apiClient;
