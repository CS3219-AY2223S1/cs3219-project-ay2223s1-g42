import { RadioGroup } from "@headlessui/react";
import cx from "classnames";

import { CheckFilledIcon } from "src/components";

export type RadioGroupValue<T extends string> = {
  title: T;
  description: string;
};

type Props<V extends string, T extends RadioGroupValue<V>> = {
  value?: V;
  updateValue: (value: V) => void;
  values: T[];
};

const BaseRadioGroup = <V extends string>({
  value,
  updateValue,
  values,
}: Props<V, RadioGroupValue<V>>) => {
  return (
    <RadioGroup
      className="flex flex-col gap-3"
      value={value}
      onChange={updateValue}
    >
      {values.map((value) => (
        <RadioGroup.Option
          key={value.title}
          value={value.title}
          className={({ checked }) =>
            cx(
              "relative flex cursor-pointer font-sans font-medium transition duration-300",
              "items-center justify-center border-[1px] border-neutral-900 px-5 py-[18px] ease-out md:px-6 md:py-5",
              {
                "bg-neutral-900": checked,
                "bg-white hover:bg-neutral-300": !checked,
              }
            )
          }
        >
          {({ checked }) => (
            <>
              <div className="flex w-full items-center justify-between">
                <div>
                  <RadioGroup.Label
                    as="p"
                    className={cx(
                      "mb-1 font-display text-xl font-semibold capitalize md:mb-2 md:text-xl md:leading-tight",
                      {
                        "text-neutral-50": checked,
                        "text-neutral-900": !checked,
                      }
                    )}
                  >
                    {value.title}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="span"
                    className={cx("inline text-sm md:text-base", {
                      "text-neutral-300": checked,
                      "text-neutral-900": !checked,
                    })}
                  >
                    {value.description}
                  </RadioGroup.Description>
                </div>
                <div className="ml-4 mr-4 h-10 w-10 shrink-0 text-neutral-50 md:ml-8">
                  {checked ? (
                    <CheckFilledIcon className="h-full w-full" />
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </>
          )}
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
};

export { BaseRadioGroup };
