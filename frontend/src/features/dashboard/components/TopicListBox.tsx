import { useQuery } from "@tanstack/react-query";
import shallow from "zustand/shallow";

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
    Axios.get("/question/topics").then((res) => res.data)
  );
  return (
    <div className="bg-red-400">
      {topics.isLoading ? (
        <SpinnerIcon className="h-4 w-4" />
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
