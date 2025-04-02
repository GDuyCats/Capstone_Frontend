import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../components/Hooks/useAuth";

const RequireAuth = ({ roles, restrictedRoles, redirectTo }) => {
  const { auth } = useAuth();
  const location = useLocation();
  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  if (auth && restrictedRoles && restrictedRoles.includes(auth.role)) {
    return <Navigate to={redirectTo || "/"} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
