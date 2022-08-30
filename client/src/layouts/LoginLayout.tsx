import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/session";

type HeaderProps = { children: string };
export const Header = ({ children }: HeaderProps) => (
	<h1 className="font-bold text-base text-center my-8">{children}</h1>
);

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
			<p className="block text-4xl text-center my-8">Habit Tracker</p>
			<Outlet />
		</div>
	);
}

export default LoginLayout;
