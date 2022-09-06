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
	const expiresAt = searchParams.get("expiresAt");

	useEffect(() => {
		if (accessToken) {
			setAuthState((authState: object) => ({
				...authState,
				accessToken,
				expiresAt: Number(expiresAt),
			}));
			setAccessToken(accessToken, Number(expiresAt));
			navigate("/");
		}
	}, [accessToken, expiresAt, navigate, setAuthState]);

	return <i className="fa-solid fa-spinner fa-spin fa-xl m-5"></i>;
};

export default AuthSuccessPage;
