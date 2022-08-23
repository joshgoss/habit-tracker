import classNames from "classnames";

type Props = {
  className: string;
  centered: boolean;
  children: string;
  icon?: string;
  onClick: Function;
};

const baseStyle = "text-start border p-2";
const defaultStyle = `${baseStyle} border-black hover:bg-gray-200`;
const Button = ({ className, centered, children, icon, onClick }: Props) => (
  <button
    className={classNames(className, defaultStyle, {})}
    onClick={(e) => onClick(e)}
  >
    {!!icon && <i className={classNames("mr-2", icon)}></i>}
    {children}
  </button>
);
Button.defaultProps = {
  className: "",
  centered: false,
};

export default Button;
