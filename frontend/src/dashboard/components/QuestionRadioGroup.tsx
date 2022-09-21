import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import cx from "classnames";

import { CheckFilledIcon } from "src/components";

const difficulties = [
  {
    name: "easy",
    description:
      "Easy questions include simple data structures and concepts such as arrays, strings, and linked lists",
  },
  {
    name: "medium",
    description:
      "Medium questions include somwhat difficult questions such as trees, graphs, and some dynamic programming",
  },
  {
    name: "hard",
    description:
      "Hard questions include more complex algorithms such as binary search, dynamic programming, and graph traversal",
  },
];

export function QuestionRadioGroup() {
  const [selected, setSelected] = useState(difficulties[0]);

  return (
    <RadioGroup
      className="flex flex-col gap-3"
      value={selected}
      onChange={setSelected}
    >
      {difficulties.map((difficulty) => (
        <RadioGroup.Option
          key={difficulty.name}
          value={difficulty}
          className={({ checked }) =>
            cx(
              "relative flex cursor-pointer font-sans font-medium transition duration-100",
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
                    {difficulty.name}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as="span"
                    className={cx("inline", {
                      "text-neutral-300": checked,
                      "text-neutral-900": !checked,
                    })}
                  >
                    {difficulty.description}
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
}
