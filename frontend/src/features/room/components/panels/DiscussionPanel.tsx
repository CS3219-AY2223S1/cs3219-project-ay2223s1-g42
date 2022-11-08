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
    <div className="px-4 py-3 text-center">
      <a
        className="border-b-[1px] border-neutral-900 font-semibold transition
        duration-300 ease-out hover:border-neutral-900"
        href={discussionLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Click for the discussion page!
      </a>
    </div>
  );
};

export { DiscussionPanel };
