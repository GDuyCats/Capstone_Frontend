import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register"
import HomePage from "./pages/HomePage";
import TaskPage from "./pages/TaskPage";
import LayoutCom from "./components/Layout/LayoutCom";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import LoginLayout from "./components/Layout/loginlayout/LoginLayout";
import RegisterLayout from "./components/Layout/registerlayout/RegisterLayout";

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
      <Route path="/" element={<RegisterLayout />}>
        <Route path="/register" element={<Register />} />
      </Route>



    </Routes>
  );
}

export default App;
