import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { MouseEventHandler } from "react";
import classNames from "classnames";

interface ItemProps {
	children: any;
	icon?: string;
	onClick?: MouseEventHandler;
}

export function DropdownItem(props: ItemProps) {
	return (
		<Menu.Item>
			{() => (
				<span
					className="block cursor-pointer hover:bg-slate-100 px-4 py-2 text-sm"
					onClick={props.onClick}
				>
					{props.children}
				</span>
			)}
		</Menu.Item>
	);
}

interface ButtonProps {
	className?: string;
	children: any;
}

export function DropdownButton({ children, className }: ButtonProps) {
	return (
		<Menu.Button
			className={`w-full justify-center rounded-md border border-gray-300
			 bg-white pl-3 pr-1 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 
			 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 
			 align-middle ${className}`}
		>
			<div className="flex flex-row items-center">
				<div>{children}</div>
				<ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
			</div>
		</Menu.Button>
	);
}

interface ItemsProps {
	children: any;
}

export function DropdownItems({ children }: ItemsProps) {
	return (
		<Menu.Items className="border absolute w-auto bg-white z-10">
			{children}
		</Menu.Items>
	);
}

interface MenuProps {
	className?: string;
	children: any;
}

export function Dropdown({ className, children }: MenuProps) {
	return (
		<Menu
			as="div"
			className={classNames("relative inline-block text-left", className)}
		>
			{children}
		</Menu>
	);
}

Dropdown.Item = DropdownItem;
Dropdown.Items = DropdownItems;
Dropdown.Button = DropdownButton;

export default Dropdown;
