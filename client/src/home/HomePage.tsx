import React, { Suspense } from "react";
import { Header } from "../layouts/app";

const HomePage = () => {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<Header>Today</Header>
		</Suspense>
	);
};

export default HomePage;
