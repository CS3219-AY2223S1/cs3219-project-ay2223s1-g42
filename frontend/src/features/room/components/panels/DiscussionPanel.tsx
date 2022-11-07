import { GetSummariesResponse } from "shared/api";
import { useGlobalStore } from "src/store";

type Props = {
  questionSummaries: GetSummariesResponse;
};

const DiscussionPanel = ({ questionSummaries }: Props) => {
  const questionIdx = useGlobalStore((state) => state.questionIdx);
  const questionSummary = questionSummaries[questionIdx];
  const discussionLink = questionSummary.discussionLink;

  return (
    <div className="flex h-full w-full flex-col px-4 py-3 md:max-w-[50vw]">
      <a
        className="border-b-[1px] border-neutral-900"
        href={discussionLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Link to discussion
      </a>
    </div>
  );
};

export { DiscussionPanel };
