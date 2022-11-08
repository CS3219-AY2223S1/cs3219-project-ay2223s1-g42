import { useQuery } from "@tanstack/react-query";

import { GetSummariesResponse } from "shared/api";
import { LoadingLayout, UnauthorizedPage } from "src/components";
import { LoadedRoom } from "src/features";
import { useGlobalStore } from "src/store";
import { Axios } from "src/services";

const QuestionPage = (): JSX.Element => {
  const user = useGlobalStore((state) => state.user);

  const questionSummaries = useQuery(["all-question-summaries"], () => {
    return Axios.get<GetSummariesResponse>(`/question/summary`).then(
      (res) => res.data
    );
  });

  if (!user) {
    return <UnauthorizedPage />;
  }

  if (questionSummaries.data) {
    return <LoadedRoom questionSummaries={questionSummaries.data} />;
  }

  return <LoadingLayout />;
};

export default QuestionPage;
