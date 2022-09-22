import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import cx from "classnames";

import { CheckIcon, ChevronDownIcon } from "src/components";

enum LANGUAGE {
  TS = "typescript",
  JS = "javascript",
  PY = "python",
  CPP = "c++",
}

const BaseListbox = () => {
  const [selected, setSelected] = useState(LANGUAGE.TS);

  return (
    <div className="w-48 z-[2] border-r-[1px] border-neutral-900">
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <div className="relative mt-1">
            <Listbox.Button
              className="relative w-full cursor-pointer bg-white py-2 pl-3 pr-10 text-left
            shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2
            focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2
            focus-visible:ring-offset-orange-300 sm:text-sm"
            >
              <span className="block truncate capitalize">{selected}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-50">
                <ChevronDownIcon
                  className={cx(
                    "h-5 w-5 text-neutral-800 transition-all ease-out duration-300 stroke-[2px]",
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
                className="absolute max-h-60 w-full overflow-auto
            bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
            focus:outline-none sm:text-sm border-t-[1px] border-t-neutral-900"
              >
                {Object.values(LANGUAGE).map((lang, i) => (
                  <Listbox.Option
                    key={i}
                    className={({ active }) =>
                      cx("relative cursor-default select-non py-2 pl-10 pr-4", {
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
