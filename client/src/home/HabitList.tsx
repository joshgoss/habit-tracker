import React from "react";
import { useRecoilValue } from "recoil";
import HabitItem from "./HabitItem";
import { fetchHistory, fetchHabits } from "./selectors";

function HabitList() {
	const habits = useRecoilValue(fetchHabits);
	const history = useRecoilValue(fetchHistory);

	return (
		<div>
			{habits.map((habit: any) => {
				const habitHistory = history.find((h: any) => h.habitId === habit._id);
				return <HabitItem habit={habit} history={habitHistory} />;
			})}
		</div>
	);
}

export default HabitList;
