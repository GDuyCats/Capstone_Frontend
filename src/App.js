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
import CreateProjectForm from "./pages/CreateProjectForm";
import RequireAuth from "./Context/RequireAuth";
import InvisibleProjects from "./pages/InvisibleProjectsPage";
import ApprovedProjects from "./pages/ApprovedProjectPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        <Route
          element={
            <RequireAuth
              restrictedRoles={["Staff"]}
              redirectTo="invisible-projects"
            />
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/task" element={<TaskPage />} />
          <Route path="/games" element={<GamePage />} />
          <Route path="/game/:id" element={<GameDetailPage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
        </Route>

        <Route element={<RequireAuth roles={["Admin"]} />}>
          <Route path="/admin/projects" element={<AdminProjectListPage />} />
        </Route>

        <Route element={<RequireAuth roles={["Staff"]} />}>
          <Route path="/invisible-projects" element={<InvisibleProjects />} />
          <Route path="/approved-projects" element={<ApprovedProjects />} />
        </Route>

        <Route element={<RequireAuth roles={["Customer"]} />}>
          <Route path="/create-project" element={<CreateProjectForm />} />
        </Route>
        <Route element={<RequireAuth roles={["Admin", "Staff"]} />}>
          <Route
            path="/admin/project/:id"
            element={<AdminProjectDetailPage />}
          />
        </Route>
        <Route element={<RequireAuth roles={["Admin", "Staff", "Customer"]} />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="/" element={<LoginLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/" element={<RegisterLayout />}>
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
