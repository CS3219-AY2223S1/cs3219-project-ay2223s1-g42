import { useQuery } from "@tanstack/react-query";
import shallow from "zustand/shallow";

import { GetAllTopicsResponse } from "shared/api";
import { BaseListbox, SpinnerIcon } from "src/components";
import { useGlobalStore } from "src/store";
import { Axios } from "src/services";

const TopicListBox = () => {
  const { matchTopics, setMatchTopics } = useGlobalStore((state) => {
    return {
      matchTopics: state.matchTopics,
      setMatchTopics: state.setMatchTopics,
    };
  }, shallow);
  const topics = useQuery(["topics"], () =>
    Axios.get<GetAllTopicsResponse>("/question/topics").then((res) => res.data)
  );
  return (
    <div>
      {topics.isLoading || !topics.data ? (
        <SpinnerIcon className="mx-auto h-6 w-6" />
      ) : (
        <BaseListbox
          value={matchTopics}
          setValue={setMatchTopics}
          values={topics.data}
          hasBorder={true}
          bigPadding={true}
        />
      )}
    </div>
  );
};

export { TopicListBox };
