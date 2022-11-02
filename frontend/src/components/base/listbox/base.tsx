import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import cx from "classnames";

import { CheckIcon, ChevronDownIcon } from "src/components";

type Props<T> = {
  value: T | undefined;
  setValue: (value: T) => void;
  values: T | T[];
  className?: string;
  hasBorder?: boolean;
  bigPadding?: boolean;
};

const BaseListbox = <T extends string | string[]>({
  value,
  setValue,
  values,
  className,
  hasBorder,
  bigPadding,
}: Props<T>) => {
  const isValueArray = Array.isArray(value);
  return (
    <div className={className}>
      <Listbox value={value} onChange={setValue} multiple={isValueArray}>
        {({ open }) => (
          <div className="relative h-full">
            <Listbox.Button
              className={cx(
                "relative h-full w-full cursor-pointer bg-white px-4 pr-10 text-left",
                "focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white",
                "focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300",
                {
                  "border-[1px] border-neutral-900": hasBorder,
                  "py-3": bigPadding,
                }
              )}
            >
              <span className="block truncate capitalize">
                {isValueArray ? `${value.length} topics selected` : value}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-50">
                <ChevronDownIcon
                  className={cx(
                    "h-5 w-5 stroke-[2px] text-neutral-800 transition-all duration-300 ease-out",
                    {
                      "rotate-180": open,
                      "rotate-0": !open,
                    }
                  )}
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={cx(
                  "py-1text-base absolute max-h-60 w-full overflow-auto bg-white shadow-lg",
                  "ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                  {
                    "border-t-[1px] border-t-neutral-900": !hasBorder,
                  }
                )}
              >
                {values.map((lang, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      cx("select-non relative cursor-default py-2 pl-10 pr-4", {
                        "bg-neutral-800 text-neutral-50": active,
                        "text-neutral-800": !active,
                      })
                    }
                    value={lang}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={cx("block truncate capitalize", {
                            "font-medium": selected,
                            "font-normal": !selected,
                          })}
                        >
                          {lang}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center px-3">
                            <CheckIcon
                              className="h-5 w-5 stroke-[2.5px]"
                              aria-hidden="true"
                            />
                          </span>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export { BaseListbox };
