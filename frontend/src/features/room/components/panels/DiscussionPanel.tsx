import { GetSummariesResponse } from "shared/api";
import { RightArrowIcon } from "src/components";
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
        className="flex justify-between border-b-[1px] border-neutral-900"
        href={discussionLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="hidden md:block">Link to discussion</span>
        <RightArrowIcon className="h-5 w-5" />
      </a>
    </div>
  );
};

export { DiscussionPanel };
