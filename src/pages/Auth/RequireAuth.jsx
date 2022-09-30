import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const tokenString = sessionStorage.getItem("token");

  return tokenString ? children : <Navigate to="/psifos/admin/login" replace />;
}

export default RequireAuth;
