import classNames from "classnames";

type Props = {
	active?: boolean;
	className: string;
	centered: boolean;
	children?: string;
	disabled?: boolean;
	icon?: string;
	onClick?: Function;
	type?: "button" | "reset" | "submit" | undefined;
};

const baseStyle = "text-start border px-3 py-2";
const defaultStyle = `${baseStyle} border-slate-300 hover:bg-gray-200 text-base`;
const Button = ({
	active,
	className,
	centered,
	children,
	disabled,
	icon,
	onClick,
	type,
}: Props) => (
	<button
		type={type ? type : "button"}
		className={classNames(className, defaultStyle, {
			"bg-slate-300": active,
			"cursor-not-allowed bg-slate-100 pointer-events-none text-slate-300":
				disabled,
		})}
		onClick={(e) => {
			if (onClick) {
				onClick(e);
			}
		}}
	>
		{!!icon && <i className={classNames("", icon)}></i>}
		{!!icon && !!children && " "}
		{!!children && children}
	</button>
);
Button.defaultProps = {
	className: "",
	centered: false,
	disabled: false,
};

export default Button;
