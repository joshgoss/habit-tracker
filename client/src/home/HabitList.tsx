import React from "react";
import { useRecoilValue } from "recoil";
import HabitItem from "./HabitItem";
import {
	getCompletedHabits,
	getUncompletedHabits,
	fetchHistory,
} from "./selectors";
import { Habit, History } from "../types";

function HabitList() {
	const completedHabits = useRecoilValue(getCompletedHabits);
	const uncompletedHabits = useRecoilValue(getUncompletedHabits);
	const history = useRecoilValue(fetchHistory);

	return (
		<div className="mt-4 flex flex-col gap-y-3">
			{uncompletedHabits.map((habit: Habit) => {
				const habitHistory = history.find(
					(h: History) => h.habitId === habit._id
				);
				return (
					<HabitItem key={habit._id} habit={habit} history={habitHistory} />
				);
			})}

			{uncompletedHabits.length > 0 && completedHabits.length > 0 && <hr />}

			{completedHabits.map((habit: Habit) => {
				const habitHistory = history.find(
					(h: History) => h.habitId === habit._id
				);
				return (
					<HabitItem key={habit._id} habit={habit} history={habitHistory} />
				);
			})}
		</div>
	);
}

export default HabitList;
