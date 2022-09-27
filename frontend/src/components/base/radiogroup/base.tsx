import type { SetStateAction, Dispatch } from "react";
import { RadioGroup } from "@headlessui/react";
import cx from "classnames";

import { CheckFilledIcon } from "src/components";

export type RadioGroupValue<Title extends string> = {
  title: Title;
  description: string;
};

type Props<T> = {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  values: T[];
};

const BaseRadioGroup = <
  RadioGroupTitle extends string,
  T extends RadioGroupValue<RadioGroupTitle>
>({
  value,
  setValue,
  values,
}: Props<T>) => {
  return (
    <RadioGroup
      className="flex flex-col gap-3"
      value={value}
      onChange={setValue}
    >
      {values.map((value) => (
        <RadioGroup.Option
          key={value.title}
          value={value}
          className={({ checked }) =>
            cx(
              "relative flex cursor-pointer font-sans font-medium transition duration-300",
              "p-4 ease-out border-[1px] border-neutral-900 justify-center items-center",
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
                <div className="text-sm">
                  <RadioGroup.Label
                    as="p"
                    className={cx(
                      "font-display font-semibold text-lg capitalize mb-2",
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
                    className={cx("inline", {
                      "text-neutral-300": checked,
                      "text-neutral-900": !checked,
                    })}
                  >
                    {value.description}
                  </RadioGroup.Description>
                </div>
                <div className="shrink-0 text-neutral-50 h-10 w-10 ml-12 mr-4">
                  {checked ? (
                    <CheckFilledIcon className="w-full h-full" />
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
