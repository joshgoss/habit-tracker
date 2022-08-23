import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAuthToken } from "../utils";

const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authToken = searchParams.get("authToken");

  console.log("authToken is: ", authToken);

  useEffect(() => {
    if (authToken) {
      setAuthToken(authToken);
      // navigate("/");
    }
  }, [navigate, authToken]);

  return <i className="fa-solid fa-spinner fa-spin fa-xl m-5"></i>;
};

export default AuthSuccessPage;
