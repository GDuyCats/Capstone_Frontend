import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import LayoutCom from "./components/Layout/LayoutCom";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProfilePage from "./pages/profilePage";
import UserProfilePage from "./pages/UserProfilePage";
import LoginLayout from "./components/Layout/loginlayout/LoginLayout";
import RegisterLayout from "./components/Layout/registerlayout/RegisterLayout";
import GamePage from "./pages/GamePage";
import GameDetailPage from "./pages/GameDetailPage";
import AdminProjectListPage from "./pages/AdminProjectListPage";
import AdminProjectDetailPage from "./pages/AdminProjectDetailPage";
import StaffProjectDetailPage from "./pages/StaffProjectDetailPage";
import CreateProjectForm from "./pages/CreateProjectForm";
import RequireAuth from "./Context/RequireAuth";
import InvisibleProjects from "./pages/InvisibleProjectsPage";
import ApprovedProjects from "./pages/ApprovedProjectPage";
import MyProjectList from "./pages/MyProjectListPage";
import UserEditProject from "./pages/UserEditProject";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        {/* 🔥 Đảm bảo Staff không thể truy cập một số trang nhất định */}
        <Route
          element={<RequireAuth restrictedRoles={["Staff"]} redirectTo="invisible-projects" />}
        >
          <Route index element={<HomePage />} />
          <Route path="task" element={<TaskPage />} />
          <Route path="games" element={<GamePage />} />
          <Route path="game/:id" element={<GameDetailPage />} />
          <Route path="project/:id" element={<ProjectDetailPage />} />
        </Route>

        {/* 🔐 Admin routes */}
        <Route element={<RequireAuth roles={["Admin"]} />}>
          <Route path="admin/projects" element={<AdminProjectListPage />} />
          <Route path="admin/project/:id" element={<AdminProjectDetailPage />} />
        </Route>

        {/* 🔐 Staff routes */}
        <Route element={<RequireAuth roles={["Staff"]} />}>
          <Route path="invisible-projects" element={<InvisibleProjects />} />
          <Route path="approved-projects" element={<ApprovedProjects />} />
          <Route path="staff/project/:id" element={<StaffProjectDetailPage />} />
        </Route>

        {/* 🔐 Customer routes */}
        <Route element={<RequireAuth roles={["Customer"]} />}>
          <Route path="create-project" element={<CreateProjectForm />} />
          <Route path="my-projects" element={<MyProjectList />} />
          <Route path="edit-project/:projectId" element={<UserEditProject />} />
        </Route>

        {/* 🔐 Các role chung */}
        <Route element={<RequireAuth roles={["Admin", "Staff", "Customer"]} />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* ✅ Profile không giới hạn quyền */}
        <Route path="profile/:id" element={<UserProfilePage />} />
      </Route>

      {/* 🔐 Layout riêng cho Login */}
      <Route element={<LoginLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      {/* 🔐 Layout riêng cho Register */}
      <Route element={<RegisterLayout />}>
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
