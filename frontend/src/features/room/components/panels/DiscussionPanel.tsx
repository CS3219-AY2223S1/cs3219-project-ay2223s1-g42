import { FlattenedQuestionSummary } from "shared/api";

const DiscussionPanel = ({
  questionSummary,
}: {
  questionSummary: FlattenedQuestionSummary;
}) => {
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
