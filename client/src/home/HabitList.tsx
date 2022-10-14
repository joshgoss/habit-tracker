import React from "react";
import { useRecoilValue } from "recoil";
import { DateTime } from "luxon";
import HabitItem from "./HabitItem";
import {
	getCompletedHabits,
	getUncompletedHabits,
	fetchHistory,
} from "./selectors";
import { historyParamsState } from "./atoms";
import { Habit, History, HabitStreak } from "../types";
import { isHabitDay } from "./utils";

function HabitList() {
	const completedHabits = useRecoilValue(getCompletedHabits);
	const uncompletedHabits = useRecoilValue(getUncompletedHabits);
	const { data: historyData, streaks } = useRecoilValue(fetchHistory);
	const { startDate } = useRecoilValue(historyParamsState);

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
						streak={habitStreak ? habitStreak.streak : 0}
						habitDay={isHabitDay(habit, DateTime.fromISO(startDate))}
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
						habitDay={isHabitDay(habit, DateTime.fromISO(startDate))}
						history={habitHistory}
						streak={habitStreak.streak}
					/>
				);
			})}
		</div>
	);
}

export default HabitList;
