import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import cx from "classnames";

import {
  CheckFilledIcon,
  CheckIcon,
  ChevronDownIcon,
} from "src/components/icons";

type DropdownItem = {
  label: string;
  icon?: JSX.Element;
};

type Props = {
  title: string;
  items?: DropdownItem[];
};

const SAMPLE_MENU_ITEMS = [
  {
    label: "Edit",
    icon: <CheckIcon className="mr-2 h-5 w-5 stroke-[2px]" />,
  },
  {
    label: "Duplicate",
    icon: <CheckFilledIcon className="mr-2 h-5 w-5 stroke-[2px]" />,
  },
  {
    label: "Archive",
    icon: undefined,
  },
  {
    label: "Move",
    icon: undefined,
  },
];

const TITLE = "Options";

const BaseDropdown = ({ items, title }: Props) => {
  const menuItems = items || SAMPLE_MENU_ITEMS;
  const menuTitle = title || TITLE;
  return (
    <Menu as="div" className="relative z-10 text-left">
      <Menu.Button
        className="flex w-full items-center justify-center border-[1px] border-neutral-900
          bg-white py-3 px-4 text-sm
          text-neutral-900 transition duration-300
          ease-out focus:outline-none hover:bg-neutral-900 hover:text-neutral-50"
      >
        {menuTitle}
        <ChevronDownIcon
          className="ml-2 -mr-1 h-5 w-5 stroke-[2px]"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-1 w-36 origin-top-right
          border-[1px] border-neutral-900 bg-white focus:outline-none"
        >
          <div>
            {menuItems.map((item) => (
              <Menu.Item key={item.label}>
                {({ active }) => (
                  <button
                    className={cx(
                      "group flex w-full items-center p-3 text-sm",
                      {
                        "bg-neutral-800 text-neutral-50": active,
                        "text-neutral-900": !active,
                      }
                    )}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export { BaseDropdown };
