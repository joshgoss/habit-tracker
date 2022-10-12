import classNames from "classnames";
import { createContext, useCallback, useContext, useMemo } from "react";

type valueType = Array<string | number>;

interface Context {
	selected: valueType;
	changeSelected: Function;
}

const ButtonGroupContext = createContext({
	selected: [],
	changeSelected: (v: string | number) => {},
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
	multiple?: boolean;
	onChange?: Function;
	selected: Array<string | number>;
}

function ButtonGroup({
	className,
	children,
	multiple,
	onChange,
	selected,
}: GroupProps) {
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

			onChange && onChange(updated);
		},
		[multiple, onChange, selected]
	);

	const contextValue = useMemo(
		() => ({
			changeSelected,
			selected,
			onChange,
		}),
		[changeSelected, onChange, selected]
	);
	return (
		<ButtonGroupContext.Provider value={contextValue}>
			<div className={className}>{children}</div>
		</ButtonGroupContext.Provider>
	);
}

ButtonGroup.Button = Button;

export default ButtonGroup;
