import { useQuery } from "@tanstack/react-query";

import { GetDailyQuestionSummaryResponse } from "shared/api";
import { Badge, SpinnerIcon } from "src/components";
import { Axios } from "src/services";

const DailyQuestionPreview = () => {
  const dailyQuestionSummary = useQuery(["daily-question-summary"], () =>
    Axios.get<GetDailyQuestionSummaryResponse>("/question/summary/daily").then(
      (res) => res.data
    )
  );
  return (
    <>
      {dailyQuestionSummary.isLoading || !dailyQuestionSummary.data ? (
        <SpinnerIcon className="mx-auto h-6 w-6" />
      ) : (
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-2xl font-bold">
            {dailyQuestionSummary.data.title}
          </h2>
          <div className="flex flex-col items-center gap-1">
            <h3 className="font-semibold">Difficulty: </h3>
            <Badge>{dailyQuestionSummary.data.difficulty}</Badge>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="font-semibold">Topics: </h3>
            <div className="flex flex-row gap-1">
              {dailyQuestionSummary.data.topicTags.map((topic) => (
                <Badge key={topic}>{topic}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { DailyQuestionPreview };
