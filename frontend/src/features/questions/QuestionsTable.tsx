import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, SortingFnOption } from "@tanstack/react-table";

import { FlattenedQuestionSummary, QuestionDifficulty } from "shared/api";
import { Badge, Table, BigHeading, LoadingLayout } from "src/components";
import { Axios } from "src/services";

function stringifyDate(date: Date) {
  date = new Date(date);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const columnHelper = createColumnHelper<FlattenedQuestionSummary>();

const difficultyOrder = {
  [QuestionDifficulty.EASY]: 1,
  [QuestionDifficulty.MEDIUM]: 2,
  [QuestionDifficulty.HARD]: 3,
};
const difficultySortingFn: SortingFnOption<FlattenedQuestionSummary> = (
  rowA,
  rowB
) => {
  const difficultyA =
    difficultyOrder[
      rowA.original.difficulty.toLowerCase() as QuestionDifficulty
    ];
  const difficultyB =
    difficultyOrder[
      rowB.original.difficulty.toLowerCase() as QuestionDifficulty
    ];
  return difficultyB > difficultyA ? -1 : 1;
};

const topicsSortingFn: SortingFnOption<FlattenedQuestionSummary> = (
  rowA,
  rowB
) => {
  const numTopicsA = rowA.original.topicTags.length;
  const numTopicsB = rowB.original.topicTags.length;
  return numTopicsB > numTopicsA ? -1 : 1;
};

export const defaultColumns = [
  columnHelper.accessor("title", {
    cell: (info) => info.getValue(),
    id: "title",
    header: "Title",
    size: 120,
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("difficulty", {
    cell: (info) => info.getValue(),
    id: "difficulty",
    header: "Difficulty",
    enableSorting: true,
    sortingFn: difficultySortingFn,
  }),
  columnHelper.accessor("acRate", {
    cell: (info) => info.getValue().toFixed(2) + "%",
    id: "acRate",
    header: "Acceptance Rate",
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("topicTags", {
    cell: (info) => (
      <div className="flex flex-wrap gap-1">
        {info.getValue().map((v, idx) => (
          <Badge key={idx}>{v}</Badge>
        ))}
      </div>
    ),
    id: "topicTags",
    header: "Topics",
    sortingFn: topicsSortingFn,
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("discussionLink", {
    cell: (info) => {
      const lcLink = info.getValue();
      return (
        <a href={lcLink} target="_blank" rel="noopener noreferrer">
          Open
        </a>
      );
    },
    header: "Discussion",
    enableSorting: false,
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => stringifyDate(info.getValue()),
    header: "Last updated",
  }),
];

const QuestionsTable = () => {
  const data = useQuery(["questions"], async () => {
    const res = await Axios.get<FlattenedQuestionSummary[] | undefined>(
      "/question/summary"
    ).then((res) => res.data);
    return res;
  });

  return (
    <div>
      {data.isLoading || !data.data ? (
        <LoadingLayout />
      ) : (
        <>
          <BigHeading className="mb-4">Questions</BigHeading>
          <Table data={data.data} columns={defaultColumns} />
        </>
      )}
    </div>
  );
};

export { QuestionsTable };
