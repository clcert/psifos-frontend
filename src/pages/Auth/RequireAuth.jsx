import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { backendOpIP } from "../../server";

function RequireAuth({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const resp = await fetch(backendOpIP + "/check-auth", {
        method: "GET",
        credentials: "include",
      });
      if (resp.ok) {
        const data = await resp.json();
        setIsLoggedIn(data.authenticated);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner or any loading indicator
  }

  return isLoggedIn ? children : <Navigate to="/psifos/admin/login" replace />;
}

export default RequireAuth;
