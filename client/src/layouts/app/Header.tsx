import classNames from "classnames";

interface Props {
	className?: string;
	children: any;
}

function Header(props: Props) {
	return (
		<h1 className={classNames("text-3xl", props.className)}>
			{props.children}
		</h1>
	);
}

export default Header;
