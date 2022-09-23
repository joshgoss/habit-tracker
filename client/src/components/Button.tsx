import classNames from "classnames";

type Props = {
	active?: boolean;
	className: string;
	centered: boolean;
	children?: any;
	disabled?: boolean;
	icon?: string;
	loading?: boolean;
	onClick?: Function;
	title?: string;
	type?: "button" | "reset" | "submit" | undefined;
};

const baseStyle = "text-start border px-3 py-2";
const defaultStyle = `${baseStyle} border-slate-300 bg-gray-50 hover:bg-gray-200 text-base`;
const Button = ({
	active,
	className,
	centered,
	children,
	disabled,
	loading,
	icon,
	onClick,
	title,
	type,
}: Props) => (
	<button
		type={type ? type : "button"}
		className={classNames(className, defaultStyle, {
			"bg-slate-300": active,
			"cursor-not-allowed bg-slate-100 pointer-events-none text-slate-300":
				disabled || loading,
		})}
		onClick={(e) => {
			if (onClick) {
				onClick(e);
			}
		}}
		title={title}
	>
		{!!icon && !loading && <i className={classNames("", icon)}></i>}
		{!!icon && !!children && " "}
		{loading && <i className="fa fa-spin fa-spinner text-center" />}
		{!!children && !loading && children}
	</button>
);
Button.defaultProps = {
	className: "",
	centered: false,
	disabled: false,
};

export default Button;
