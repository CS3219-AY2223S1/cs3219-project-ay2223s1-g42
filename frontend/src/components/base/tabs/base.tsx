import { Tab } from "@headlessui/react";
import cx from "classnames";

type BaseProp = {
  values: Record<string, JSX.Element>;
};

const BaseTabs = ({ values }: BaseProp) => {
  return (
    <Tab.Group>
      <Tab.List className="flex flex-row divide-x-[1px] divide-neutral-900">
        {Object.keys(values).map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              cx(
                "w-full border-b-[1px] border-b-neutral-900 py-2.5 md:py-2",
                "rounded-none focus:outline-none ",
                {
                  "bg-neutral-800 text-neutral-50": selected,
                  "bg-white text-neutral-800 hover:bg-neutral-300": !selected,
                }
              )
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels
        className="h-full max-h-[75vh] w-full overflow-y-scroll py-3 md:scrollbar-thin
        md:scrollbar-thumb-neutral-300 lg:h-[calc(100%-42px)] lg:max-h-full"
      >
        {Object.values(values).map((value, i) => (
          <Tab.Panel key={i}>{value}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export { BaseTabs };
