import classNames from "classnames";

interface Props {
	className?: string;
	children: any;
	htmlFor: string;
	required?: boolean;
	error?: boolean;
}

function InputLabel(props: Props) {
	const classes = classNames(
		"block mb-1",
		{
			"text-red-700": props.error,
		},
		props.className
	);
	return (
		<label className={classes} htmlFor={props.htmlFor}>
			{props.children}
			{props.required && <span className="text text-red-600">*</span>}
		</label>
	);
}

export default InputLabel;
