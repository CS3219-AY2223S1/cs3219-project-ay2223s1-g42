import type { ReactNode } from "react";

import { BaseTabs } from "src/components";

const RoomTabs = () => {
  const tabValues: Record<string, ReactNode> = {
    Description: <>{"Question description here!!!"}</>,
    Solution: <>{"Question solution here!!!"}</>,
    Submissions: <>{"Question submissions here!!!"}</>,
  };
  return <BaseTabs values={tabValues} />;
};

export { RoomTabs };
