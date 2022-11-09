import { useQuery } from "@tanstack/react-query";
import { createColumnHelper, SortingFnOption } from "@tanstack/react-table";
import { formatDistance } from "date-fns";

import { FlattenedQuestionSummary, QuestionDifficulty } from "shared/api";
import {
  PrimaryBadge,
  Table,
  BigHeading,
  LoadingLayout,
  PrimaryLink,
} from "src/components";
import { Axios } from "src/services";

function formatDate(date: Date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
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
          <PrimaryBadge key={idx}>{v}</PrimaryBadge>
        ))}
      </div>
    ),
    id: "topicTags",
    header: "Topics",
    sortingFn: topicsSortingFn,
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("titleSlug", {
    cell: (info) => {
      const slug = info.getValue();
      return (
        <PrimaryLink to={`/question?slug=${slug}`}>View question</PrimaryLink>
      );
    },
    header: "Question URL",
    enableSorting: false,
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => formatDate(info.getValue()),
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
          <BigHeading className="mb-12">Questions</BigHeading>
          <Table data={data.data} columns={defaultColumns} />
        </>
      )}
    </div>
  );
};

export { QuestionsTable };
