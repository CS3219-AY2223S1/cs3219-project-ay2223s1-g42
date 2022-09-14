import { useState } from "react";
import { RadioGroup } from "@headlessui/react";

const difficulties = [
  {
    name: "Easy",
  },
  {
    name: "Medium",
  },
  {
    name: "Hard",
  },
];

export function RadioGroupButtons() {
  const [selected, setSelected] = useState(difficulties[0]);

  return (
    <div className="w-full px-4 py-16">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={setSelected}>
          {/* <RadioGroup.Label className="sr-only text-neutral-900">
            Difficulty level
          </RadioGroup.Label> */}
          <div className="space-y-2">
            {difficulties.map((difficulty) => (
              <RadioGroup.Option
                key={difficulty.name}
                value={difficulty}
                className={({ checked }) =>
                  `
                  ${
                    checked
                      ? "bg-neutral-900"
                      : "bg-neutral-50 hover:bg-neutral-400"
                  }
                    relative flex cursor-pointer font-sans font-medium transition duration-100 px-3 py-3 ease-out border-[1px] justify-center items-center `
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-sans font-medium ${
                              checked
                                ? "text-neutral-50"
                                : "text-neutral-900 hover:text-neutral-50"
                            }`}
                          >
                            {difficulty.name}
                          </RadioGroup.Label>
                          {/* <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-neutral-50" : "text-neutral-900"
                            }`}
                          ></RadioGroup.Description> */}
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}

function CheckIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
