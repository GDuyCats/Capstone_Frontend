import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LayoutCom from "./components/Layout/LayoutCom";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import TaskPage from "./pages/TaskPage";
import CreateProjectPage from "./pages/CreateProjectPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutCom />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />{" "}
        <Route path="/create-project" element={<CreateProjectPage />} />{" "}
        <Route path="/task" element={<TaskPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
