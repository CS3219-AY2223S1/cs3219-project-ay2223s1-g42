import { FlattenedQuestionSummary } from "shared/api";
import { BaseTabs } from "src/components";
import { AttemptPanel, DiscussionPanel, QuestionPanel } from "./panels";

const RoomTabs = ({
  questionSummary,
}: {
  questionSummary: FlattenedQuestionSummary;
}) => {
  const tabValues: Record<string, JSX.Element> = {
    Description: (
      <QuestionPanel key="question-panel" questionSummary={questionSummary} />
    ),
    Attempts: <AttemptPanel questionSummary={questionSummary} />,
    Discussion: <DiscussionPanel questionSummary={questionSummary} />,
  };
  return <BaseTabs values={tabValues} />;
};

export { RoomTabs };
