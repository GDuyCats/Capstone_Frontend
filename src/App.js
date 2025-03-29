import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
// import TaskPage from "./pages/TaskPage";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        <Route element={<RequireAuth roles={["Admin"]}></RequireAuth>}>
          <Route path="/admin/projects" element={<AdminProjectListPage />} />
          <Route path="/admin/project/:id" element={<AdminProjectDetailPage />} />
        </Route>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        <Route path="/project/:id" element={<ProjectDetailPage />} />{" "}
        <Route path="/create-project" element={<CreateProjectForm />} />{" "}
        <Route element={<RequireAuth roles={["Staff"]}></RequireAuth>}></Route>
        <Route element={<RequireAuth roles={["Customer"]}></RequireAuth>}></Route>
        {/* <Route path="/task" element={<TaskPage />} /> */}
        <Route path="/profile/:id" element={<UserProfilePage />} />
        <Route path="/games" element={<GamePage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
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
