import React from "react";
import { useSetRecoilState } from "recoil";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as R from "ramda";
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
	habit?: Habit;
	onClose?: Function;
}

function HabitForm({ habit, onClose }: Props) {
	const defaultValues: Habit = {
		name: "",
		amount: 1,
		frequency: Frequency.Daily,
		dayOfMonth: 1,
		daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
		color: colors[random(0, colors.length - 1)],
		icon: icons[random(0, icons.length - 1)],
	};
	const {
		control,
		register,
		handleSubmit,
		setValue,
		formState: { isValid, isSubmitting },
	} = useForm({
		mode: "onChange",
		defaultValues: habit
			? R.pick(Object.keys(defaultValues), habit)
			: defaultValues,
	});
	const frequency = useWatch({ name: "frequency", control });
	const setForceHabitsRefresh = useSetRecoilState(forceHabitsRefresh);
	const onSubmit = async (data: any) => {
		if (habit) {
			await api.put(`/habits/${habit._id}`, data);
		} else {
			await api.post("/habits", data);
		}

		setForceHabitsRefresh((v) => v + 1);

		onClose && onClose();
	};

	return (
		<form
			className="bg-slate-100 p-5 border border-slate-300"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
				<Input
					className="lg:col-span-3"
					label="Name"
					name="name"
					register={register}
					registerOptions={{ required: true }}
					placeholder="My habit..."
				/>

				<div className="lg:col-span-1">
					<div className="flex space-x-4">
						<IconPicker
							required
							defaultValue={habit ? habit.icon : defaultValues.icon}
							onChange={(v: string): void => setValue("icon", v)}
						/>
						<ColorPicker
							defaultValue={habit ? habit.color : defaultValues.color}
							onChange={(v: string): void => setValue("color", v)}
							required
						/>
					</div>
				</div>

				<Controller
					control={control}
					name="frequency"
					render={({ field: { onChange, value, name } }) => (
						<ButtonGroupInput
							name="frequency"
							label="Frequency"
							onChange={(values: Array<Frequency>) => {
								const v = values[0];
								onChange(v);

								if (v === Frequency.Daily) {
									setValue("daysOfWeek", defaultValues.daysOfWeek);
								} else if (v === Frequency.Weekly) {
									setValue("daysOfWeek", [DayOfWeek.Monday]);
								}
							}}
							required
							selected={[value]}
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
					)}
				/>

				{frequency === Frequency.Monthly && (
					<Input
						name="dayOfMonth"
						label="Day of Month"
						register={register}
						registerOptions={{
							required: true,
							min: 1,
							max: 31,
							valueAsNumber: true,
						}}
						type="number"
					/>
				)}

				{(frequency === Frequency.Daily || frequency === Frequency.Weekly) && (
					<Controller
						control={control}
						name="daysOfWeek"
						render={({ field: { onChange, value, name } }) => (
							<ButtonGroupInput
								name="daysOfWeek"
								label="Days of Week"
								multiple={frequency === Frequency.Daily}
								onChange={(values: DayOfWeek[]) => {
									setValue("daysOfWeek", values);
								}}
								selected={value}
								required
							>
								<ButtonGroupInput.Button value={DayOfWeek.Sunday}>
									Sun
								</ButtonGroupInput.Button>
								<ButtonGroupInput.Button value={DayOfWeek.Monday}>
									Mon
								</ButtonGroupInput.Button>
								<ButtonGroupInput.Button value={DayOfWeek.Tuesday}>
									Tue
								</ButtonGroupInput.Button>
								<ButtonGroupInput.Button value={DayOfWeek.Wednesday}>
									Wed
								</ButtonGroupInput.Button>
								<ButtonGroupInput.Button value={DayOfWeek.Thursday}>
									Thu
								</ButtonGroupInput.Button>
								<ButtonGroupInput.Button value={DayOfWeek.Friday}>
									Fri
								</ButtonGroupInput.Button>
								<ButtonGroupInput.Button value={DayOfWeek.Saturday}>
									Sat
								</ButtonGroupInput.Button>
							</ButtonGroupInput>
						)}
					/>
				)}

				<Input
					label="Amount"
					name="amount"
					placeholder="1"
					register={register}
					registerOptions={{
						required: true,
						min: 1,
						valueAsNumber: true,
					}}
					type="number"
				/>
			</div>
			<div className="flow-root mt-5">
				<Button
					className="float-right"
					disabled={!isValid}
					loading={isSubmitting}
					type="submit"
				>
					{habit ? "Save" : "Create"}
				</Button>
				<Button
					className="float-right mr-2"
					onClick={(e: any) => {
						onClose && onClose();
					}}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}

export default HabitForm;
