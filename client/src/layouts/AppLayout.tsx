import React, { useEffect, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { fetchAccount } from "../account/selectors";
import { isAuthenticated } from "../utils/session";

function TopBar() {
	const account = useRecoilValue(fetchAccount);
	return <div>{account.firstName}</div>;
}

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
			<Suspense fallback={<p>Loading...</p>}>
				<Suspense>
					<TopBar />
				</Suspense>

				<Outlet />
			</Suspense>
		</div>
	);
}

export default AppLayout;
