import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../components/Hooks/useAuth";

const RequireAuth = ({ roles, restrictedRoles, redirectTo }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // Nếu user chưa đăng nhập mà trang này yêu cầu quyền hạn, thì chuyển hướng đến login
  if (!auth && roles) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu user đã đăng nhập nhưng KHÔNG có quyền truy cập vào trang này
  if (auth && roles && !roles.includes(auth.role)) {
    return <Navigate to="/" replace />;
  }

  // Nếu user thuộc restrictedRoles, chuyển hướng về redirectTo
  if (auth && restrictedRoles && restrictedRoles.includes(auth.role)) {
    return <Navigate to={redirectTo || "/"} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
