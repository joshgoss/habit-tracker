import React from "react";
import InputLabel from "./InputLabel";

interface Props {
	className?: string;
	defaultValue?: any;
	label?: string;
	min?: number | string;
	max?: number | string;
	name: string;
	onBlur: React.FocusEventHandler;
	onChange: React.ChangeEventHandler;
	placeholder?: string;
	required?: boolean;
	type?: string;
}

const Input = React.forwardRef((props: Props, ref: any) => {
	return (
		<div className={props.className}>
			{!!props.label && (
				<InputLabel htmlFor={props.name} required={props.required}>
					{props.label}
				</InputLabel>
			)}
			<input
				className="border border-slate-300 rounded p-2 w-full"
				name={props.name}
				type={props.type || "text"}
				defaultValue={props.defaultValue}
				min={props.min}
				max={props.max}
				onBlur={props.onBlur}
				onChange={props.onChange}
				required={props.required}
				placeholder={props.placeholder}
				ref={ref}
			/>
		</div>
	);
});

export default Input;
