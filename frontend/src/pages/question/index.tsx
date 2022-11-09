import { useQuery } from "@tanstack/react-query";

import { GetSummariesResponse } from "shared/api";
import { LoadingLayout } from "src/components";
import { LoadedRoom } from "src/features";
import { Axios } from "src/services";

const QuestionPage = (): JSX.Element => {
  const questionSummaries = useQuery(["all-question-summaries"], () => {
    return Axios.get<GetSummariesResponse>(`/question/summary`).then(
      (res) => res.data
    );
  });

  if (questionSummaries.data) {
    return <LoadedRoom questionSummaries={questionSummaries.data} />;
  }

  return <LoadingLayout />;
};

export default QuestionPage;
