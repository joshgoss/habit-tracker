interface Props {
	habit: {
		_id: string;
		amount: number;
		color: string;
		createdAt: string;
		daysOfWeek: string[];
		dayOfMonth?: number;
		frequency: string;
		icon: string;
		name: string;
		userId: string;
		updatedAt: string;
	};
	history?: {
		amount: number;
		completed: boolean;
		createdAt: string;
		date: string;
		userId: string;
		habitId: string;
		updatedAt: string;
	};
}

function HabitItem(props: Props) {
	return <div>{props.habit.name}</div>;
}

export default HabitItem;
