import sanitizeHtml from "sanitize-html";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
} from "html-react-parser";
import { useQuery } from "@tanstack/react-query";

import {
  FlattenedQuestionSummary,
  GetSlugContentResponse,
  QuestionDifficulty,
} from "shared/api";
import { Axios } from "src/services";
import {
  LoadingLayout,
  YellowBadge,
  GreenBadge,
  RedBadge,
  PrimaryBadge,
} from "src/components";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (
      domNode instanceof Element &&
      domNode.attribs &&
      domNode.name === "pre"
    ) {
      return (
        <pre className="mt-4 mb-8 whitespace-pre-line bg-white py-4 px-6 text-neutral-900">
          {domToReact(domNode.children, options)}
        </pre>
      );
    }
  },
};

const QuestionPanel = ({
  questionSummary,
}: {
  questionSummary: FlattenedQuestionSummary;
}) => {
  const questionSlug = questionSummary.titleSlug;
  const questionDataQuery = useQuery(["question-data", questionSlug], () =>
    Axios.get<GetSlugContentResponse>(`/question/content/${questionSlug}`).then(
      (res) => res.data
    )
  );

  return (
    <>
      {questionDataQuery.isLoading || !questionDataQuery.data ? (
        <LoadingLayout />
      ) : (
        <div className="flex h-full w-full flex-col px-4 py-3 md:max-w-[50vw]">
          <div className="mb-6">
            <h1 className="mb-3 font-display text-3xl font-bold">
              {questionSummary.title}
            </h1>
            {questionSummary.difficulty.toLowerCase() ===
            QuestionDifficulty.EASY ? (
              <GreenBadge className="font-bold">
                {questionSummary.difficulty}
              </GreenBadge>
            ) : questionSummary.difficulty.toLowerCase() ===
              QuestionDifficulty.MEDIUM ? (
              <YellowBadge className="font-bold">
                {questionSummary.difficulty}
              </YellowBadge>
            ) : questionSummary.difficulty.toLowerCase() ===
              QuestionDifficulty.HARD ? (
              <RedBadge className="font-bold">
                {questionSummary.difficulty}
              </RedBadge>
            ) : (
              <></>
            )}
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              {questionSummary.topicTags.map((topic) => (
                <PrimaryBadge
                  key={topic}
                  uppercase={false}
                  className="capitalize"
                >
                  {topic}
                </PrimaryBadge>
              ))}
            </div>
          </div>
          {parse(sanitizeHtml(questionDataQuery.data.content), options)}
        </div>
      )}
    </>
  );
};

export { QuestionPanel };
