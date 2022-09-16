import { useState } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { Habit, History } from "../types";
import { Button } from "../components";
import { forceHistoryRefresh, historyParamsState } from "./atoms";
import { setHistory } from "./utils";

interface Props {
	habit: Habit;
	history?: History;
}

function HabitItem({ habit, history }: Props) {
	const [editing, setEditing] = useState(false);
	const [minusing, setMinusing] = useState(false);
	const [adding, setAdding] = useState(false);
	const [completing, setCompleting] = useState(false);
	const [undoing, setUndoing] = useState(false);

	const setForceHistoryRefresh = useSetRecoilState(forceHistoryRefresh);
	const [historyParams] = useRecoilState(historyParamsState);

	const historyId = history ? history._id : null;
	const amount = history ? history.amount : 0;
	const completed = history ? history.completed : false;

	return (
		<>
			{editing && <div>editing</div>}
			{!editing && (
				<div className="rounded flex flex-row items-center h-16 relative border">
					<div
						className="absolute h-full"
						style={{
							background: habit.color,
							zIndex: -1,
							width: `${(amount / habit.amount) * 100}%`,
						}}
					></div>
					<i className={`fa fa-solid ${habit.icon} text-3xl ml-4 mr-4`} />
					<h3 className="text-xl grow">{habit.name}</h3>

					<div className="w-5 mr-10">
						<p className="text-center text-xl text-gray-800">
							{history ? history.amount : 0}
						</p>
						<div className="h-px bg-black w-full" />
						<p className="text-center text-xl text-gray-800">{habit.amount}</p>
					</div>

					{amount > 0 && !completed && (
						<Button
							className="h-full"
							icon="fa-solid fa-minus"
							loading={minusing}
							onClick={async () => {
								setMinusing(true);
								await setHistory(
									{
										amount: amount - 1,
										date: historyParams.startDate,
										habitId: habit._id as string,
									},
									historyId
								);
								setForceHistoryRefresh((n) => n + 1);
								setMinusing(false);
							}}
						/>
					)}

					{habit.amount - amount > 1 &&
						(!history || history.amount < habit.amount - 1) && (
							<Button
								className="h-full"
								icon="fa-solid fa-plus"
								loading={adding}
								onClick={async () => {
									setAdding(true);
									await setHistory(
										{
											amount: amount + 1,
											date: historyParams.startDate,
											habitId: habit._id as string,
										},
										historyId
									);
									setForceHistoryRefresh((n) => n + 1);
									setAdding(false);
								}}
							/>
						)}

					{habit.amount - amount === 1 && (
						<Button
							className="h-full"
							icon="fa-solid fa-check"
							title="Complete habit"
							loading={completing}
							onClick={async () => {
								setCompleting(true);
								await setHistory(
									{
										amount: habit.amount,
										date: historyParams.startDate,
										habitId: habit._id as string,
									},
									historyId
								);
								setForceHistoryRefresh((n) => n + 1);
								setCompleting(false);
							}}
						/>
					)}

					{completed && (
						<Button
							className="h-full"
							icon="fa-solid fa-undo"
							title="Undo completion of habit"
							loading={undoing}
							onClick={async () => {
								setUndoing(true);
								await setHistory(
									{
										amount: habit.amount - 1,
										date: historyParams.startDate,
										habitId: habit._id as string,
									},
									historyId
								);
								setForceHistoryRefresh((n) => n + 1);
								setUndoing(false);
							}}
						/>
					)}

					<Button
						className="h-full flex-none"
						icon="fa-solid fa-cog"
						title="Change settings"
					/>
				</div>
			)}
		</>
	);
}

export default HabitItem;
