import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import LayoutCom from "./components/Layout/LayoutCom";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import LoginLayout from "./components/Layout/loginlayout/LoginLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />{" "}
        <Route path="/create-project" element={<CreateProjectPage />} />{" "}
        <Route path="/task" element={<TaskPage />} />
      </Route>
      <Route path="/" element={<LoginLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

    </Routes>
  );
}

export default App;
