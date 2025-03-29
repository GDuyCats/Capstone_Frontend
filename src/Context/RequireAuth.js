import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../components/Hooks/useAuth";
import { useState, useEffect } from "react";
import { Spin } from "antd";

const RequireAuth = ({ roles, restrictedRoles, redirectTo }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    if (auth !== undefined) {
      setIsChecking(false); // ✅ Đánh dấu đã kiểm tra quyền truy cập
    }
  }, [auth]);

  // ✅ Hiển thị loading nếu đang kiểm tra quyền
  if (isChecking) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  // Nếu chưa đăng nhập, chuyển đến trang login và lưu lại trang muốn truy cập
  if (!auth?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //  Nếu có roles nhưng người dùng không thuộc nhóm role được phép, chặn truy cập
  if (roles && !roles.includes(auth?.role)) {

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
