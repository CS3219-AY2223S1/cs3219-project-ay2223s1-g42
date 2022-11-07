import sanitizeHtml from "sanitize-html";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
} from "html-react-parser";
import { useQuery } from "@tanstack/react-query";

import { GetSlugContentResponse, GetSummariesResponse } from "shared/api";
import { useGlobalStore } from "src/store";
import { Axios } from "src/services";
import { Badge, LoadingLayout } from "src/components";

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
  questionSummaries,
}: {
  questionSummaries: GetSummariesResponse;
}) => {
  const questionIdx = useGlobalStore((state) => state.questionIdx);
  const questionSummary = questionSummaries[questionIdx];
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
            <Badge>{questionSummary.difficulty}</Badge>
          </div>
          {parse(sanitizeHtml(questionDataQuery.data.content), options)}
        </div>
      )}
    </>
  );
};

export { QuestionPanel };
