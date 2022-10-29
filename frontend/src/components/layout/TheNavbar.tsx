import { useState } from "react";
import cx from "classnames";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import shallow from "zustand/shallow";

import {
  BaseLink,
  PrimaryLink,
  PrimaryButton,
  BurgerMenuIcon,
  CloseIcon,
} from "src/components";
import { useScrollDirection, useMobile, ScrollDir } from "src/hooks";
import { useGlobalStore } from "src/store";

type NavItem = {
  label: string;
  href: string;
  isLast?: boolean;
};

const LINKS_LOGGED_IN = [
  {
    label: "settings",
    href: "/user/settings",
  },
  { label: "history", href: "/user/history" },
  { label: "questions", href: "/questions/all" },
];

const LINKS_LOGGED_OUT = [
  { label: "questions", href: "/questions/all" },
  { label: "login", href: "/login" },
  { label: "signup", href: "/signup" },
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

const MobileNavItems = ({
  isOpen,
  isSignedIn,
}: {
  isOpen: boolean;
  isSignedIn: boolean;
}) => {
  const links = isSignedIn ? LINKS_LOGGED_IN : LINKS_LOGGED_OUT;
  return (
    <div
      className={cx(
        "mb-4 w-full items-center justify-between bg-white transition-all duration-300 ease-out md:hidden",
        {
          hidden: !isOpen,
          block: isOpen,
          "mt-1": isSignedIn,
          "mt-0": !isSignedIn,
        }
      )}
    >
      <ul
        className="flex flex-col border border-neutral-800 
        text-center font-semibold uppercase"
      >
        {links.slice(0, -1).map((item) => (
          <MobileNavItem key={item.label} {...item} />
        ))}
        {links.slice(-1).map((item) => (
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
        {LINKS_LOGGED_IN.map((item) => (
          <DesktopNavItem key={item.label} {...item} />
        ))}
      </ul>
    </div>
  );
};

const TheNavbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, useSignoutMutation } = useGlobalStore((state) => {
    return {
      user: state.user,
      useSignoutMutation: state.useSignoutMutation,
    };
  }, shallow);
  const isMobile = useMobile();
  const scrollDirection = useScrollDirection();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const isSignedIn = !!user;
  const signoutMutation = useSignoutMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["me"]);
      navigate("/login");
    },
  });

  const handleSignout = () => {
    signoutMutation.mutate();
  };

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
          <span className="self-center whitespace-nowrap font-sans text-xl font-semibold text-neutral-800">
            {"<PeerPrep />"}
          </span>
        </BaseLink>
        <div className="flex flex-row gap-2 md:gap-6">
          {isSignedIn ? (
            <>
              <DesktopNavItems />
              <PrimaryButton
                className="bg-neutral-100 px-4 text-base md:px-6"
                onClick={handleSignout}
                isLoading={signoutMutation.isLoading}
              >
                Log out
              </PrimaryButton>
              <PrimaryButton
                type="button"
                className="inline-flex items-center bg-white p-3 text-sm text-neutral-800
                focus:outline-none hover:text-neutral-800 md:hidden"
                onClick={() => setIsDropdownOpen((open) => !open)}
              >
                <span className="sr-only">Toggle main menu</span>
                {isDropdownOpen ? (
                  <CloseIcon className="h-7 w-7" />
                ) : (
                  <BurgerMenuIcon className="h-7 w-7" />
                )}
              </PrimaryButton>
            </>
          ) : (
            <>
              {isMobile ? (
                <PrimaryButton
                  type="button"
                  className="inline-flex items-center bg-white p-3 text-sm text-neutral-800
                  focus:outline-none hover:text-neutral-800 md:hidden"
                  onClick={() => setIsDropdownOpen((open) => !open)}
                >
                  <span className="sr-only">Toggle main menu</span>
                  {isDropdownOpen ? (
                    <CloseIcon className="h-7 w-7" />
                  ) : (
                    <BurgerMenuIcon className="h-7 w-7" />
                  )}
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  className="bg-neutral-100 px-4 text-base md:px-6"
                  onClick={() => navigate("/signup")}
                >
                  Get started
                </PrimaryButton>
              )}
            </>
          )}
        </div>
      </div>
      {/* mobile nav dropdown */}
      <MobileNavItems isOpen={isDropdownOpen} isSignedIn={isSignedIn} />
    </nav>
  );
};

export { TheNavbar };
