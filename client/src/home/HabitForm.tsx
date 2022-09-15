import React from "react";
import { useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import api from "../utils/api";
import colors from "../utils/colors";
import icons from "../utils/icons";
import { random } from "../utils";
import { DayOfWeek, Frequency, Habit } from "../types";
import { forceHabitsRefresh } from "./atoms";

import {
	Button,
	ButtonGroupInput,
	ColorPicker,
	IconPicker,
	Input,
} from "../components";

interface Props {
	onClose?: Function;
}

function HabitForm(props: Props) {
	const defaultValues: Habit = {
		name: "",
		amount: 1,
		frequency: Frequency.Daily,
		daysOfWeek: [],
		color: colors[random(0, colors.length - 1)],
		icon: icons[random(0, icons.length - 1)],
	};
	const {
		register,
		handleSubmit,
		setValue,
		formState: { isValid, isSubmitting },
	} = useForm({ mode: "onChange", defaultValues });
	const setForceHabitsRefresh = useSetRecoilState(forceHabitsRefresh);
	const onSubmit = async (data: any) => {
		await api.post("/habits", data);
		setForceHabitsRefresh((v) => v + 1);

		if (props.onClose) {
			props.onClose();
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<div className="grid grid-cols-12 gap-3">
				<Input
					className="col-span-10"
					label="Name"
					{...register("name", { required: true })}
					required={true}
					placeholder="My habit..."
				/>

				<div className="col-span-1">
					<div className="flex space-x-4">
						<IconPicker
							required
							defaultValue={defaultValues.icon}
							onChange={(v: string): void => setValue("icon", v)}
						/>
						<ColorPicker
							defaultValue={defaultValues.color}
							onChange={(v: string): void => setValue("color", v)}
							required
						/>
					</div>
				</div>
				<ButtonGroupInput
					className="col-span-3"
					name="daysOfWeek"
					label="Days of Week"
					defaultValue={[]}
					multiple
					onChange={(v: Array<DayOfWeek>) => {
						setValue("daysOfWeek", v);
					}}
					required
				>
					<ButtonGroupInput.Button value={0}>Mon</ButtonGroupInput.Button>
					<ButtonGroupInput.Button value={1}>Tue</ButtonGroupInput.Button>
					<ButtonGroupInput.Button value={2}>Wed</ButtonGroupInput.Button>
					<ButtonGroupInput.Button value={3}>Thu</ButtonGroupInput.Button>
					<ButtonGroupInput.Button value={4}>Fri</ButtonGroupInput.Button>
					<ButtonGroupInput.Button value={5}>Sat</ButtonGroupInput.Button>
					<ButtonGroupInput.Button value={6}>Sun</ButtonGroupInput.Button>
				</ButtonGroupInput>

				<ButtonGroupInput
					className="col-span-2"
					name="frequency"
					label="Frequency"
					defaultValue={[Frequency.Daily]}
					onChange={(v: Array<Frequency>) => {
						v.length && setValue("frequency", v[0]);
					}}
					required
				>
					<ButtonGroupInput.Button value={Frequency.Daily}>
						Daily
					</ButtonGroupInput.Button>
					<ButtonGroupInput.Button value={Frequency.Weekly}>
						Weekly
					</ButtonGroupInput.Button>
					<ButtonGroupInput.Button value={Frequency.Monthly}>
						Monthly
					</ButtonGroupInput.Button>
				</ButtonGroupInput>

				<Input
					{...register("amount", {
						required: true,
						min: 1,
						valueAsNumber: true,
					})}
					required={true}
					className="col-span-4"
					label="Amount"
					type="number"
					placeholder="1"
				/>
			</div>

			<div className="flow-root mt-5">
				<Button
					className="float-right"
					disabled={!isValid}
					loading={isSubmitting}
					type="submit"
				>
					Create
				</Button>
				<Button
					className="float-right mr-2"
					onClick={(e: any) => {
						if (props.onClose) {
							props.onClose();
						}
					}}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}

export default HabitForm;
