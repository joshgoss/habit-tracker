import React, { Suspense } from "react";

const HomePage = () => {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<h1>Home page</h1>
		</Suspense>
	);
};

export default HomePage;
