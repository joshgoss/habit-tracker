import React from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { setAccessToken } from "../utils/session";
import { authState } from "./atoms";

const AuthSuccessPage = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const setAuthState = useSetRecoilState(authState);
	const accessToken = searchParams.get("accessToken");

	useEffect(() => {
		if (accessToken) {
			setAuthState((authState: object) => ({ ...authState, accessToken }));
			setAccessToken(accessToken);
			navigate("/");
		}
	}, [accessToken, navigate, setAuthState]);

	return <i className="fa-solid fa-spinner fa-spin fa-xl m-5"></i>;
};

export default AuthSuccessPage;
