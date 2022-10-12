import ButtonGroup, { Button } from "./ButtonGroup";
import Label from "./InputLabel";

interface Props {
	children: any;
	className?: string;
	label?: string;
	multiple?: boolean;
	name: string;
	onChange?: Function;
	required?: boolean;
	selected: Array<string | number>;
}

function ButtonGroupInput({
	className,
	children,
	label,
	multiple,
	name,
	onChange,
	required,
	selected,
}: Props) {
	return (
		<ButtonGroup
			className={className}
			multiple={multiple}
			onChange={onChange}
			selected={selected}
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
