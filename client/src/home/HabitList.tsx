import React from "react";
import { useRecoilValue } from "recoil";
import HabitItem from "./HabitItem";
import {
	getCompletedHabits,
	getUncompletedHabits,
	fetchHistory,
} from "./selectors";
import { Habit, History, HabitStreak } from "../types";

function HabitList() {
	const completedHabits = useRecoilValue(getCompletedHabits);
	const uncompletedHabits = useRecoilValue(getUncompletedHabits);
	const { data: historyData, streaks } = useRecoilValue(fetchHistory);

	return (
		<div className="mt-4 flex flex-col gap-y-3">
			{uncompletedHabits.map((habit: Habit) => {
				const habitHistory = historyData.find(
					(h: History) => h.habitId === habit._id
				);

				const habitStreak = streaks.find(
					(s: HabitStreak) => s.habitId === habit._id
				);
				return (
					<HabitItem
						key={habit._id}
						habit={habit}
						history={habitHistory}
						streak={habitStreak.streak}
					/>
				);
			})}

			{uncompletedHabits.length > 0 && completedHabits.length > 0 && <hr />}

			{completedHabits.map((habit: Habit) => {
				const habitHistory = historyData.find(
					(h: History) => h.habitId === habit._id
				);
				const habitStreak = streaks.find(
					(s: HabitStreak) => s.habitId === habit._id
				);
				return (
					<HabitItem
						key={habit._id}
						habit={habit}
						history={habitHistory}
						streak={habitStreak.streak}
					/>
				);
			})}
		</div>
	);
}

export default HabitList;
