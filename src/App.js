import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import LayoutCom from "./components/Layout/LayoutCom";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProfilePage from "./pages/profilePage";
import UserProfilePage from "./pages/UserProfilePage";
import LoginLayout from "./components/Layout/loginlayout/LoginLayout";
import GamePage from "./pages/GamePage";
import GameDetailPage from "./pages/GameDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />{" "}
        <Route path="/create-project" element={<CreateProjectPage />} />{" "}
        <Route path="/task" element={<TaskPage />} />
        <Route path="/profile/:id" element={<UserProfilePage />} />
        <Route path="/games" element={<GamePage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
      </Route>
      <Route path="/" element={<LoginLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
