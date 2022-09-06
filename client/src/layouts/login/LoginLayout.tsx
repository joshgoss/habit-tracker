import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/session";

function LoginLayout() {
	const navigate = useNavigate();
	const authenticated = isAuthenticated();

	useEffect(() => {
		if (authenticated) {
			navigate("/");
		}
	}, [navigate, authenticated]);
	return (
		<div className="container max-w-2xl mx-auto">
			<p className="block text-4xl text-center my-8 text-sky-500">
				Habit Tracker
			</p>
			<Outlet />
		</div>
	);
}

export default LoginLayout;
