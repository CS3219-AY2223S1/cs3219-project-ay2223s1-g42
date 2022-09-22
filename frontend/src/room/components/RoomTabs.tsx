import type { ReactNode } from "react";

import { BaseTabs } from "src/components";
import { QuestionPanel } from "./QuestionPanel";

const RoomTabs = () => {
  const tabValues: Record<string, ReactNode> = {
    Description: <QuestionPanel />,
    Solution: <>{"Question solution here!!!"}</>,
    Submissions: <>{"Question submissions here!!!"}</>,
  };
  return <BaseTabs values={tabValues} />;
};

export { RoomTabs };
