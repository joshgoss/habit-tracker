import React, { Suspense, useState } from "react";
import { Header } from "../layouts/app";
import { Button } from "../components";
import HabitList from "./HabitList";
import HabitForm from "./HabitForm";

const HomePage = () => {
	const [adding, setAdding] = useState(false);

	return (
		<Suspense fallback={<p>Loading...</p>}>
			<div className="flow-root mb-4">
				<Header className="inline float-left">Today</Header>
				<Button
					className="float-left ml-2 text-slate-600"
					icon="fa fa-calendar-days"
					onClick={() => {}}
				></Button>

				<Button
					active={adding}
					className="float-right"
					icon="fa fa-plus"
					onClick={() => {
						setAdding(!adding);
					}}
				>
					Add
				</Button>
			</div>
			{adding && (
				<HabitForm
					onClose={() => {
						setAdding(false);
					}}
				/>
			)}
			<HabitList />
		</Suspense>
	);
};

export default HomePage;
