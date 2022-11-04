import { GetSummariesResponse } from "shared/api";
import { BaseTabs } from "src/components";
import { QuestionPanel } from "./QuestionPanel";

const RoomTabs = ({
  questionIdx,
  questionSummaries,
}: {
  questionIdx: number;
  questionSummaries: GetSummariesResponse;
}) => {
  const tabValues: Record<string, JSX.Element> = {
    Description: (
      <QuestionPanel
        key={questionIdx}
        questionIdx={questionIdx}
        questionSummaries={questionSummaries}
      />
    ),
    Solution: <>{"Question solution here!!!"}</>,
    Submissions: <>{"Question submissions here!!!"}</>,
  };
  return <BaseTabs values={tabValues} />;
};

export { RoomTabs };
