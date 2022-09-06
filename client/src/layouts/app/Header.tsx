interface Props {
	children: any;
}

function Header(props: Props) {
	return <h1 className="text-3xl">{props.children}</h1>;
}

export default Header;
