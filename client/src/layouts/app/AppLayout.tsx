import React, { useEffect, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../../auth/atoms";
import { clearAccessToken } from "../../utils/session";
import TopBar from "./TopBar";

function AppLayout() {
	const navigate = useNavigate();
	const [auth, setRecoilState] = useRecoilState(authState);

	useEffect(() => {
		if (!auth.accessToken) {
			return navigate("/login");
		}

		const now = Date.now();
		if (auth.expiresAt && now >= auth.expiresAt) {
			setRecoilState((authState: object) => {
				return {
					...authState,
					accessToken: null,
					expiresAt: null,
				};
			});

			clearAccessToken();

			return navigate("/login");
		}
	}, [auth.accessToken, auth.expiresAt, navigate, setRecoilState]);
	return (
		<div className="md:container  mx-auto">
			<Suspense fallback={<p>Loading...</p>}>
				<TopBar />
			</Suspense>

			<Outlet />
		</div>
	);
}

export default AppLayout;
