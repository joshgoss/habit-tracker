import ItemPicker from "./ItemPicker";
import colors from "../utils/colors";
import { random } from "../utils";

interface Props {
	className?: string;
	label?: string;
	name?: string;
	defaultValue?: string | number;
	onChange?: Function;
	required?: boolean;
}

function ColorPicker({
	className,
	defaultValue,
	label,
	name,
	onChange,
	required,
}: Props) {
	const randomDefault = colors[random(0, colors.length - 1)];

	return (
		<ItemPicker
			className={className}
			defaultValue={defaultValue || randomDefault}
			defaultDisplay={
				<div className="w-8 h-8" style={{ background: randomDefault }}></div>
			}
			label={label || "Color"}
			name={name || "color"}
			onChange={onChange}
			required={required}
		>
			<ItemPicker.Items>
				{colors.map((c) => (
					<ItemPicker.Item key={c} value={c}>
						<div className="w-8 h-8" style={{ background: c }}></div>
					</ItemPicker.Item>
				))}
			</ItemPicker.Items>
		</ItemPicker>
	);
}

export default ColorPicker;
