import { GetSummariesResponse } from "shared/api";
import { BaseTabs } from "src/components";
import { AttemptPanel, DiscussionPanel, QuestionPanel } from "./panels";

const RoomTabs = ({
  questionSummaries,
}: {
  questionSummaries: GetSummariesResponse;
}) => {
  const tabValues: Record<string, JSX.Element> = {
    Description: (
      <QuestionPanel
        key="question-panel"
        questionSummaries={questionSummaries}
      />
    ),
    Attempts: <AttemptPanel questionSummaries={questionSummaries} />,
    Solution: <DiscussionPanel questionSummaries={questionSummaries} />,
  };
  return <BaseTabs values={tabValues} />;
};

export { RoomTabs };
