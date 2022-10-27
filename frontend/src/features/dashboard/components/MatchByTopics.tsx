import { useQuery } from "@tanstack/react-query";

import { SearchWithDropdown } from "src/components";
import { Axios } from "src/services";

const MatchByTopics = () => {
  const topics = useQuery(["topics"], () =>
    Axios.get("/question/topics").then((res) => res.data)
  );
  return (
    <>
      {topics.isLoading ? (
        "Loading..."
      ) : (
        <SearchWithDropdown topics={topics.data} />
      )}
    </>
  );
};

export { MatchByTopics };
