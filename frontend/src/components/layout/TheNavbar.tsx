import { useState } from "react";
import cx from "classnames";

import {
  BaseLink,
  PrimaryLink,
  BaseDropdown,
  PrimaryButton,
  BurgerMenuIcon,
} from "src/components";
import { useScrollDirection, useMobile, ScrollDir } from "src/hooks";

type NavItem = {
  label: string;
  href: string;
  isLast?: boolean;
};

const LINKS = [
  { label: "dashboard", href: "/" },
  {
    label: "settings",
    href: "/user/settings",
  },
];

const MobileNavItem = ({ label, href, isLast }: NavItem) => {
  return (
    <li
      className={cx("px-3 py-1", {
        "border-b-[1px] border-neutral-900 ": !isLast,
      })}
    >
      <BaseLink to={href} className="my-2 block">
        {label}
      </BaseLink>
    </li>
  );
};

const MobileNavItems = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={cx(
        "mb-4 mt-2 w-full items-center justify-between bg-white transition-all duration-300 ease-out md:hidden",
        { hidden: !isOpen, block: isOpen }
      )}
    >
      <ul
        className="flex flex-col border border-neutral-800 
        text-center font-semibold uppercase"
      >
        {LINKS.slice(0, -1).map((item) => (
          <MobileNavItem key={item.label} {...item} />
        ))}
        {LINKS.slice(-1).map((item) => (
          <MobileNavItem key={item.label} {...item} isLast={true} />
        ))}
      </ul>
    </div>
  );
};

const DesktopNavItem = ({ label, href }: NavItem) => {
  return (
    <li>
      <PrimaryLink to={href} className="my-2 block">
        {label}
      </PrimaryLink>
    </li>
  );
};

const DesktopNavItems = () => {
  return (
    <div className="hidden w-full items-center justify-between md:flex md:w-auto">
      <ul className="flex flex-row gap-8 border-neutral-800 px-4 text-center text-sm font-semibold uppercase">
        {LINKS.map((item) => (
          <DesktopNavItem key={item.label} {...item} />
        ))}
      </ul>
    </div>
  );
};

const TheNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const scrollDirection = useScrollDirection();
  const isMobile = useMobile();

  return (
    <nav
      className={cx(
        "fixed z-50 flex w-full flex-col px-4 font-display",
        "bg-neutral-100/[0.95] backdrop-blur-sm transition-all duration-300 ease-out",
        {
          "translate-y-0": scrollDirection !== ScrollDir.DOWN && isMobile,
          "-translate-y-20": scrollDirection === ScrollDir.DOWN && isMobile,
          "-translate-y-60":
            scrollDirection === ScrollDir.DOWN && isDropdownOpen && isMobile,
        }
      )}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-5xl flex-wrap items-center justify-between">
        <BaseLink to={"/"} className="flex h-full items-center">
          {/* <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          /> */}
          <span className="self-center whitespace-nowrap font-sans text-xl font-semibold text-neutral-800">
            {"<PeerPrep />"}
          </span>
        </BaseLink>
        <div className="flex flex-row gap-2 md:gap-4">
          <DesktopNavItems />
          <BaseDropdown />
          {/* <PrimaryButton
            className="text-base px-4 md:px-6 bg-neutral-100"
            onClick={() => navigate("/room")}
          >
            Get started
          </PrimaryButton> */}
          <PrimaryButton
            type="button"
            className="inline-flex items-center bg-white p-3 text-sm
            text-neutral-800 focus:outline-none hover:text-neutral-800 md:hidden"
            onClick={() => setIsDropdownOpen((open) => !open)}
          >
            <span className="sr-only">Open main menu</span>
            <BurgerMenuIcon className="h-7 w-7" />
          </PrimaryButton>
        </div>
      </div>
      {/* mobile nav dropdown */}
      <MobileNavItems isOpen={isDropdownOpen} />
    </nav>
  );
};

export { TheNavbar };
