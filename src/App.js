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
import AdminProjectListPage from "./pages/AdminProjectListPage";
import AdminProjectDetailPage from "./pages/AdminProjectDetailPage";
import StaffProjectDetailPage from "./pages/StaffProjectDetailPage";
import CreateProjectForm from "./pages/CreateProjectForm";
import RequireAuth from "./Context/RequireAuth";
import InvisibleProjects from "./pages/InvisibleProjectsPage";
import ApprovedProjects from "./pages/ApprovedProjectPage";
import MyProjectList from "./pages/MyProjectListPage";
import UserEditProject from "./pages/UserEditProject";
import FileManagerPage from "./pages/FileManagerPage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import PaymentResult from "./pages/PaymentResult";
import PledgesPage from "./pages/PledgesPage";
import FaqManagementPage from "./pages/FaqManagementPage";
import CollaboratorManagementPage from "./pages/CollaboratorManagementPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        {/* 🔥 Đảm bảo Staff không thể truy cập một số trang nhất định */}
        <Route path="/payment/result" element={<PaymentResult />} />
        <Route
          element={
            <RequireAuth
              restrictedRoles={["STAFF"]}
              redirectTo="invisible-projects"
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="/creator/:id" element={<CreatorProfilePage />} />
          <Route path="project/:id" element={<ProjectDetailPage />} />
        </Route>

        {/* 🔐 Admin routes */}
        <Route element={<RequireAuth roles={["ADMIN"]} />}>
          <Route path="admin/projects" element={<AdminProjectListPage />} />
          <Route
            path="admin/project/:id"
            element={<AdminProjectDetailPage />}
          />
        </Route>

        {/* 🔐 Staff routes */}
        <Route element={<RequireAuth roles={["STAFF"]} />}>
          <Route path="invisible-projects" element={<InvisibleProjects />} />
          <Route path="approved-projects" element={<ApprovedProjects />} />
          <Route
            path="staff/project/:id"
            element={<StaffProjectDetailPage />}
          />
        </Route>

        {/* 🔐 Customer routes */}
        <Route element={<RequireAuth roles={["CUSTOMER"]} />}>
          <Route path="create-project" element={<CreateProjectForm />} />
          <Route path="my-projects" element={<MyProjectList />} />
          <Route path="manage-faqs" element={<FaqManagementPage />} />
          <Route path="edit-project/:projectId" element={<UserEditProject />} />
          <Route path="/pledges" element={<PledgesPage />} />
          <Route
            path="manage-collaborators"
            element={<CollaboratorManagementPage />}
          />
          <Route
            path="manage-collaborators/:projectId"
            element={<CollaboratorManagementPage />}
          />
        </Route>

        {/* 🔐 Các role chung */}
        <Route element={<RequireAuth roles={["ADMIN", "STAFF", "CUSTOMER"]} />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="files" element={<FileManagerPage />} />
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
