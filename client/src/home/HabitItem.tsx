import { useState } from "react";
import { useSetRecoilState, useRecoilState } from "recoil";
import { Habit, History } from "../types";
import { Button, Dropdown } from "../components";
import {
	forceHistoryRefresh,
	forceHabitsRefresh,
	historyParamsState,
} from "./atoms";
import { setHistory, getStreakText } from "./utils";
import api from "../utils/api";
import HabitForm from "./HabitForm";

interface Props {
	habit: Habit;
	habitDay: boolean;
	history?: History;
	streak?: number;
}

function HabitItem({ habit, history, habitDay, streak }: Props) {
	const [editing, setEditing] = useState(false);
	const [minusing, setMinusing] = useState(false);
	const [adding, setAdding] = useState(false);
	const [completing, setCompleting] = useState(false);
	const [undoing, setUndoing] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const setForceHistoryRefresh = useSetRecoilState(forceHistoryRefresh);
	const setForceHabitsRefresh = useSetRecoilState(forceHabitsRefresh);
	const [historyParams] = useRecoilState(historyParamsState);

	const historyId = history ? history._id : null;
	const amount = history ? history.amount : 0;
	const completed = history ? history.completed : false;

	return (
		<>
			{editing && <HabitForm habit={habit} onClose={() => setEditing(false)} />}
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

					{!!streak && (
						<div className="w-15 h-full bg-gray-700 px-3 py-1 align-middle">
							<i className="fa fa-fire text-2xl text-center  text-amber-400	align-middle block" />
							<p className="text-xs text-center text-amber-400 font-bold">
								{streak} {getStreakText(streak, habit.frequency)}
							</p>
						</div>
					)}

					{habitDay && amount > 0 && !completed && (
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

					{habitDay &&
						habit.amount - amount > 1 &&
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

					{habitDay && habit.amount - amount === 1 && (
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

					{habitDay && completed && (
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

					<Dropdown className="h-full">
						<Dropdown.Button className="h-full rounded-none">
							<i className="fa fa-solid fa-cog" />
						</Dropdown.Button>

						<Dropdown.Items className="right-0">
							<Dropdown.Item
								onClick={(e) => {
									e.preventDefault();
									setEditing(!editing);
								}}
							>
								Edit
							</Dropdown.Item>
							<Dropdown.Item
								onClick={async (e) => {
									e.preventDefault();
									if (!deleting) {
										setDeleting(true);
										await api.destroy(`/habits/${habit._id}`);
										setForceHabitsRefresh((n) => n + 1);
										setDeleting(false);
									}
								}}
							>
								Delete
							</Dropdown.Item>
						</Dropdown.Items>
					</Dropdown>
				</div>
			)}
		</>
	);
}

export default HabitItem;
