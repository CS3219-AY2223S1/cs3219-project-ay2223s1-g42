import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import cx from "classnames";

import { CheckFilledIcon, CheckIcon, ChevronDownIcon } from "src/components";

type DropdownItem = {
  label: string;
  icon?: React.ReactNode;
};

type Props = {
  items?: DropdownItem[];
};

const SAMPLE_MENU_ITEMS = [
  {
    label: "Edit",
    icon: <CheckIcon className="h-5 w-5 stroke-[2px] mr-2" />,
  },
  {
    label: "Duplicate",
    icon: <CheckFilledIcon className="h-5 w-5 stroke-[2px] mr-2" />,
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

const BaseDropdown = ({ items = SAMPLE_MENU_ITEMS }: Props) => {
  return (
    <Menu as="div" className="text-left z-10 relative">
      <Menu.Button
        className="flex w-full justify-center py-3 px-4 items-center
          focus:outline-none border-neutral-900 bg-white text-sm
          text-neutral-900 hover:bg-neutral-900 hover:text-neutral-50
          transition duration-300 ease-out border-[1px]"
      >
        Options
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
          className="absolute mt-1 w-36 right-0 origin-top-right
          border-[1px] border-neutral-900 bg-white focus:outline-none"
        >
          <div>
            {items.map((item) => (
              <Menu.Item key={item.label}>
                {({ active }) => (
                  <button
                    className={cx(
                      "group flex w-full items-center text-sm p-3",
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
