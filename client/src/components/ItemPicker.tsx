import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import classNames from "classnames";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Label from "./InputLabel";

type ValueType = string | number | undefined;

interface Selected {
	value?: ValueType;
	display: any;
}

interface Context {
	selected: Selected;
	changeSelected: Function;
	defaultValue?: ValueType;
	defaultDisplay?: any;
	onChange?: Function;
}

const ItemPickerContext = createContext({
	selected: { value: undefined, display: undefined },
	changeSelected: (s: Selected) => {},
	onChange: () => {},
	defaultValue: undefined,
	defaultDisplay: undefined,
} as Context);

interface ItemProps {
	value: string | number;
	children: any;
}

function Item({ children, value }: ItemProps) {
	const { changeSelected, selected } = useContext(ItemPickerContext);
	return (
		<div
			className={classNames("border-2 border-white hover:border-slate-400", {
				"border-black": selected.value === value,
			})}
			onClick={(e) => {
				changeSelected({ value, display: children } as Selected);
			}}
		>
			{children}
		</div>
	);
}

interface ItemsProps {
	children: any;
}

function Items({ children }: ItemsProps) {
	return <div className="flex flex-wrap flex-row ">{children}</div>;
}

interface ItemPickerProps {
	className?: string;
	children: any;
	defaultValue?: string | number;
	defaultDisplay: any;
	label?: string | undefined;
	name?: string | undefined;
	required?: boolean;
	onChange?: Function;
}

function ItemPicker({
	className,
	children,
	defaultValue,
	defaultDisplay,
	label,
	name,
	required,
	onChange,
}: ItemPickerProps) {
	const [opened, setOpened] = useState(false);
	const [selected, setSelected] = useState({
		value: defaultValue,
		display: defaultDisplay,
	} as Selected);

	const changeSelected = useCallback(
		(s: Selected) => {
			onChange && onChange(s && s.value);
			setSelected(s);
		},
		[onChange, setSelected]
	);

	const contextValue = useMemo(
		() => ({
			changeSelected,
			defaultDisplay,
			defaultValue,
			selected,
			onChange,
		}),
		[changeSelected, defaultDisplay, defaultValue, onChange, selected]
	);

	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleOutsideClick = (e: any) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setOpened(false);
			}
		};

		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, [setOpened]);

	return (
		<ItemPickerContext.Provider value={contextValue}>
			<div className={`inline-block ${className || ""}`} ref={ref}>
				{!!label && (
					<Label htmlFor={name || ""} required>
						{label}
					</Label>
				)}
				<button
					type="button"
					className={classNames(
						"w-12 h-12 border relative hover:bg-slate-100",
						{
							"bg-slate-100": opened,
						}
					)}
					onClick={(e) => {
						e.preventDefault();
						setOpened(!opened);
					}}
				>
					<div className="flex justify-center">
						{!!selected.display && selected.display}
					</div>

					<ChevronDownIcon
						className="absolute bottom-0 right-0 h-5 w-5"
						aria-hidden="true"
					/>
					{opened && (
						<div
							className="border absolute left-0 mt-10 p-1 bg-white w-36 max-h-28 overflow-y-auto"
							style={{ left: 0, bottom: "-120px" }}
						>
							{children}
						</div>
					)}
				</button>
			</div>
		</ItemPickerContext.Provider>
	);
}

ItemPicker.Items = Items;
ItemPicker.Item = Item;

export default ItemPicker;
