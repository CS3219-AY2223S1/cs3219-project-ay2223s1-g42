import { useQuery } from "@tanstack/react-query";

import {
  GetDailyQuestionSummaryResponse,
  QuestionDifficulty,
} from "shared/api";
import {
  PrimaryBadge,
  GreenBadge,
  RedBadge,
  SpinnerIcon,
  YellowBadge,
} from "src/components";
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
            {dailyQuestionSummary.data.difficulty.toLowerCase() ===
            QuestionDifficulty.EASY ? (
              <GreenBadge>{dailyQuestionSummary.data.difficulty}</GreenBadge>
            ) : dailyQuestionSummary.data.difficulty.toLowerCase() ===
              QuestionDifficulty.MEDIUM ? (
              <YellowBadge>{dailyQuestionSummary.data.difficulty}</YellowBadge>
            ) : dailyQuestionSummary.data.difficulty.toLowerCase() ===
              QuestionDifficulty.HARD ? (
              <RedBadge>{dailyQuestionSummary.data.difficulty}</RedBadge>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <h3 className="font-semibold">Topics: </h3>
            <div className="flex flex-row gap-1">
              {dailyQuestionSummary.data.topicTags.map((topic) => (
                <PrimaryBadge key={topic}>{topic}</PrimaryBadge>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { DailyQuestionPreview };
