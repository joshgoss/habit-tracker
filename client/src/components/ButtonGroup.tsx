import classNames from "classnames";
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type valueType = Array<string | number>;

interface Context {
	selected: valueType;
	changeSelected: Function;
	defaultValue: valueType;
	multiple?: boolean;
	onChange?: Function;
}

const ButtonGroupContext = createContext({
	selected: [],
	changeSelected: (v: string | number) => {},
	defaultValue: [],
} as Context);

interface ButtonProps {
	value: string | number;
	children: any;
}

export function Button({ children, value }: ButtonProps) {
	const { changeSelected, selected } = useContext(ButtonGroupContext);

	return (
		<button
			className={classNames(
				"p-2 border-r border-y first-of-type:border-l first-of-type:rounded-l last-of-type:rounded-r",
				{
					"bg-slate-300": selected.includes(value),
				}
			)}
			type="button"
			onClick={(e) => {
				e.preventDefault();
				changeSelected(value);
			}}
		>
			{children}
		</button>
	);
}

interface GroupProps {
	className?: string;
	children: any;
	defaultValue: valueType;
	multiple?: boolean;
	onChange?: Function;
}

function ButtonGroup({
	className,
	children,
	defaultValue,
	multiple,
	onChange,
}: GroupProps) {
	const [selected, setSelected] = useState(defaultValue);
	const changeSelected = useCallback(
		(v: string | number) => {
			let updated: Array<string | number> = [];

			if (!multiple) {
				updated = [v];
			} else if (selected.includes(v)) {
				updated = selected.filter((s) => s !== v);
			} else {
				updated = [...selected, v];
			}

			setSelected(updated);
			onChange && onChange(updated);
			return v;
		},
		[multiple, onChange, selected, setSelected]
	);

	const contextValue = useMemo(
		() => ({
			changeSelected,
			defaultValue,
			multiple,
			selected,
			onChange,
		}),
		[changeSelected, defaultValue, multiple, onChange, selected]
	);
	return (
		<ButtonGroupContext.Provider value={contextValue}>
			<div className={className}>{children}</div>
		</ButtonGroupContext.Provider>
	);
}

ButtonGroup.Button = Button;

export default ButtonGroup;
