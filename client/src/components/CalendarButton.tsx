import { useRef, useState } from "react";
import { Button } from "../components";

interface Props {
	className?: string;
	children?: any;
	initialValue?: string;
	onChange?: Function;
}

function CalendarButton({
	className,
	children,
	initialValue,
	onChange,
}: Props) {
	const [date, setDate] = useState(initialValue);
	const inputRef: any = useRef(null);

	return (
		<Button
			className={className}
			icon="fa fa-calendar-days"
			onClick={(e: any) => {
				e.preventDefault();
				if (inputRef && inputRef.current) {
					inputRef.current.showPicker();
				}
			}}
		>
			<input
				type="date"
				onChange={(e) => {
					const val = e.target.value;
					setDate(val);
					onChange && onChange(val);
				}}
				ref={inputRef}
				style={{ opacity: 0, width: 0 }}
				value={date}
			/>
			{children}
		</Button>
	);
}

export default CalendarButton;
