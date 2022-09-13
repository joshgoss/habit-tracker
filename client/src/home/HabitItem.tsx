import { Habit, History } from "../types";
interface Props {
	habit: Habit;
	history?: History;
}

function HabitItem(props: Props) {
	return <div>{props.habit.name}</div>;
}

export default HabitItem;
