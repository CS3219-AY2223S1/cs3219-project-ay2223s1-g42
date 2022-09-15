import { useState } from "react";
import cx from "classnames";

import { BurgerMenuIcon } from "src/components/icons";
import { PrimaryButton } from "../../base/button";
import { BaseLink, PrimaryLink } from "src/components/base/link";

type NavItem = {
  label: string;
  href: string;
  isLast?: boolean;
};

const LINKS = [
  {
    label: "match",
    href: "/login",
  },
  {
    label: "history",
    href: "/dashboard",
  },
  {
    label: "questions",
    href: "/questions",
  },
];

const MobileNavItem = ({ label, href, isLast }: NavItem) => {
  return (
    <li
      className={cx("px-3 py-1", {
        "border-b-[1px] border-neutral-900 ": !isLast,
      })}
    >
      <BaseLink href={href} className="block my-2">
        {label}
      </BaseLink>
    </li>
  );
};

const MobileNavItems = () => {
  return (
    <div className="justify-between items-center w-full md:hidden">
      <ul
        className="flex flex-col mt-4 border border-neutral-800 
        font-semibold uppercase text-center"
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
      <PrimaryLink href={href} className="block my-2">
        {label}
      </PrimaryLink>
    </li>
  );
};

const DesktopNavItems = () => {
  return (
    <div className="hidden justify-between items-center w-full md:flex md:w-auto">
      <ul className="flex flex-row px-4 border-neutral-800 gap-8 text-sm font-semibold uppercase text-center">
        {LINKS.map((item) => (
          <DesktopNavItem key={item.label} {...item} />
        ))}
      </ul>
    </div>
  );
};

const TheNavbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <nav className="font-display pl-4 pr-2 py-3 md:p-4 bg-neutral-100 fixed w-full z-50 top-0 left-0">
      <div className="max-w-5xl flex flex-wrap justify-between items-center mx-auto">
        <a href="#" className="flex items-center h-full">
          {/* <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          /> */}
          <span className="font-display self-center text-2xl font-semibold whitespace-nowrap text-neutral-800">
            PussyPrep
          </span>
        </a>
        <div className="flex flex-row gap-3 md:gap-4">
          <DesktopNavItems />
          <PrimaryButton className="text-base md:px-6">
            Get started
          </PrimaryButton>
          <button
            type="button"
            className="inline-flex items-center p-2 text-sm text-neutral-800 md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="sr-only">Open main menu</span>
            <BurgerMenuIcon className="h-7 w-7" />
          </button>
        </div>
      </div>
      {/* mobile nav dropdown */}
      {isOpen ? <MobileNavItems /> : <></>}
    </nav>
  );
};

export { TheNavbar };
