type HeaderProps = { children: string };
const Header = ({ children }: HeaderProps) => (
	<h1 className="font-bold text-base text-center my-8">{children}</h1>
);

export default Header;
