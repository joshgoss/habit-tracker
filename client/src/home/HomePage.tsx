import React, { Suspense, useState } from "react";
import { useRecoilState } from "recoil";
import { Header } from "../layouts/app";
import { CalendarButton, Button } from "../components";
import HabitList from "./HabitList";
import HabitForm from "./HabitForm";
import { historyParamsState } from "./atoms";
import { formatDate } from "../utils/date";

const HomePage = () => {
	const [adding, setAdding] = useState(false);
	const [historyState, setHistoryState] = useRecoilState(historyParamsState);
	const formatted = formatDate(historyState.startDate);
	const title = formatted === formatDate(new Date()) ? "Today" : formatted;

	return (
		<Suspense fallback={<p>Loading...</p>}>
			<div className="flow-root mb-4">
				<Header className="inline float-left">{title}</Header>
				<CalendarButton
					className="float-left ml-2 text-slate-600"
					initialValue={formatted}
					onChange={(date: string) => {
						setHistoryState({
							startDate: new Date(date),
							endDate: new Date(date),
						});
					}}
				/>

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
