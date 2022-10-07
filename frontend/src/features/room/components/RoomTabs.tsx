import { BaseTabs } from "src/components";
import { QuestionPanel } from "./QuestionPanel";

const RoomTabs = () => {
  const tabValues: Record<string, JSX.Element> = {
    Description: <QuestionPanel />,
    Solution: <>{"Question solution here!!!"}</>,
    Submissions: <>{"Question submissions here!!!"}</>,
  };
  return <BaseTabs values={tabValues} />;
};

export { RoomTabs };
