import ItemPicker from "./ItemPicker";
import icons from "../utils/icons";
import { random } from "../utils";

interface Props {
	className?: string;
	label?: string;
	name?: string;
	defaultValue?: string | number;
	onChange?: Function;
	required?: boolean;
}

function IconPicker({
	className,
	defaultValue,
	label,
	name,
	onChange,
	required,
}: Props) {
	const randomDefault = icons[random(0, icons.length - 1)];
	const classes = `w-8 h-8 fa fa-solid text-lg`;

	return (
		<ItemPicker
			className={className}
			defaultValue={defaultValue || randomDefault}
			defaultDisplay={
				<i className={`${classes} ${defaultValue || randomDefault}`} />
			}
			label={label || "Icon"}
			name={name || "icons"}
			onChange={onChange}
			required={required}
		>
			<ItemPicker.Items>
				{icons.map((icon) => (
					<ItemPicker.Item key={icon} value={icon}>
						<i className={`${classes} ${icon}`} />
					</ItemPicker.Item>
				))}
			</ItemPicker.Items>
		</ItemPicker>
	);
}

export default IconPicker;
