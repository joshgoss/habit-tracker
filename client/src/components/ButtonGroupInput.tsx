import ButtonGroup, { Button } from "./ButtonGroup";
import Label from "./InputLabel";

interface Props {
	children: any;
	className?: string;
	defaultValue: Array<string | number>;
	label?: string;
	multiple?: boolean;
	name: string;
	onChange?: Function;
	required?: boolean;
}

function ButtonGroupInput({
	className,
	children,
	defaultValue,
	label,
	multiple,
	name,
	onChange,
	required,
}: Props) {
	return (
		<ButtonGroup
			className={className}
			defaultValue={defaultValue}
			multiple={multiple}
			onChange={onChange}
		>
			{!!label && (
				<Label htmlFor={name} required={required}>
					{label}
				</Label>
			)}
			{children}
		</ButtonGroup>
	);
}

ButtonGroupInput.Button = Button;

export default ButtonGroupInput;
