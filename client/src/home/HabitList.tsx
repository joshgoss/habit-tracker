import React from "react";
import { useRecoilValue } from "recoil";
import HabitItem from "./HabitItem";
import { fetchHistory, fetchHabits } from "./selectors";

function HabitList() {
	const habits = useRecoilValue(fetchHabits);
	const history = useRecoilValue(fetchHistory);

	return (
		<div className="mt-4 flex flex-col gap-y-3">
			{habits.map((habit: any) => {
				const habitHistory = history.find((h: any) => h.habitId === habit._id);
				return (
					<HabitItem key={habit._id} habit={habit} history={habitHistory} />
				);
			})}
		</div>
	);
}

export default HabitList;
