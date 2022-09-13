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
					className="block cursor-pointer hover:bg-slate-50 px-4 py-2 text-sm"
					onClick={props.onClick}
				>
					{props.children}
				</span>
			)}
		</Menu.Item>
	);
}

interface MenuProps {
	title: string;
	className?: string;
	children: any;
}

export function Dropdown(props: MenuProps) {
	return (
		<Menu
			as="div"
			className={classNames("relative inline-block text-left", props.className)}
		>
			<div>
				<Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
					{props.title}
					<ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
				</Menu.Button>
			</div>

			<Menu.Items className="border absolute w-full bg-white">
				{props.children}
			</Menu.Items>
		</Menu>
	);
}

Dropdown.Item = DropdownItem;

export default Dropdown;
