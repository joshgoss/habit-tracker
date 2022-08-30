import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import { AppLayout, LoginLayout } from "./layouts";
import { AuthSuccessPage, LoginPage } from "./auth";
import { HomePage } from "./home";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<Routes>
					<Route path="/auth-success" element={<AuthSuccessPage />} />
					<Route element={<LoginLayout />}>
						<Route path="/login" element={<LoginPage />} />
					</Route>
					<Route element={<AppLayout />}>
						<Route path="/" element={<HomePage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
