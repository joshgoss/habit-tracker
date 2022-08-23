import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils";

function AppLayout() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (!authenticated) {
      navigate("/login");
    }
  }, [navigate, authenticated]);
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AppLayout;
