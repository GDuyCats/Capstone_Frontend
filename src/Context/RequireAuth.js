import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../components/Hooks/useAuth";

const RequireAuth = ({ roles }) => {
  const { auth } = useAuth();
  const location = useLocation();
  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
