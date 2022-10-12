import React from "react";
import { RegisterOptions } from "react-hook-form";
import InputLabel from "./InputLabel";

interface Props {
	className?: string;
	defaultValue?: any;
	label?: string;
	name: string;
	placeholder?: string;
	register: Function;
	registerOptions: RegisterOptions;
	type?: string;
}

const Input = ({
	className,
	defaultValue,
	label,
	name,
	placeholder,
	register,
	registerOptions,
	type,
}: Props) => {
	return (
		<div className={className}>
			{!!label && (
				<InputLabel
					htmlFor={name}
					required={registerOptions && registerOptions?.required}
				>
					{label}
				</InputLabel>
			)}
			<input
				className="border border-slate-300 rounded p-2 w-full"
				defaultValue={defaultValue}
				name={name}
				placeholder={placeholder}
				type={type || "text"}
				{...register(name, registerOptions)}
			/>
		</div>
	);
};

export default Input;
