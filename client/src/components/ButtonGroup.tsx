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
	onChange: () => {},
	defaultValue: [],
} as Context);

interface ButtonProps {
	value: string | number;
	children: any;
}

export function Button({ children, value }: ButtonProps) {
	const { changeSelected, onChange, selected } = useContext(ButtonGroupContext);

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

				if (onChange) {
					onChange(selected);
				}
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
			if (!multiple) {
				return setSelected([v]);
			}

			if (selected.includes(v)) {
				setSelected(selected.filter((s) => s !== v));
			} else {
				setSelected([...selected, v]);
			}
			return v;
		},
		[multiple, selected, setSelected]
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
