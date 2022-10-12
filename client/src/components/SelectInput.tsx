import InputLabel from "./InputLabel";

interface OptionProps {
	children: any;
	value: string | number;
}
const Option = ({ children, value }: OptionProps) => {
	return <option value={value}>{children}</option>;
};

interface SelectProps {
	children: any;
	label?: string;
	name: string;
	register: Function;
}
const Select = ({ children, label, name, register }: SelectProps) => {
	return (
		<>
			<InputLabel htmlFor={name}>{label}</InputLabel>

			<select className="border border-slate-400 p-2" {...register(name)}>
				{children}
			</select>
		</>
	);
};

Select.Option = Option;

export default Select;
