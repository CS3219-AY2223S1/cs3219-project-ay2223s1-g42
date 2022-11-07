import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDistance } from "date-fns";

import { Attempt, GetSummariesResponse } from "shared/api";
import { Table, BigHeading, LoadingLayout } from "src/components";
import { Axios } from "src/services";
import { useGlobalStore } from "src/store";

function formatDate(date: Date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

const createColumns = () => {
  const columnHelper = createColumnHelper<Attempt>();

  const columns = [
    columnHelper.accessor("updatedAt", {
      cell: (info) => formatDate(info.getValue()),
      id: "updatedAt",
      header: "Last updated",
    }),
    columnHelper.accessor("content", {
      cell: (info) => (
        <code className="block whitespace-pre">{info.getValue()}</code>
      ),
      id: "content",
      header: "Details",
      maxSize: 500,
      enableSorting: false,
    }),
  ];
  return columns;
};

type Props = {
  questionSummaries: GetSummariesResponse;
};

const AttemptPanel = ({ questionSummaries }: Props) => {
  const questionIdx = useGlobalStore((state) => state.questionIdx);
  const questionSummary = questionSummaries[questionIdx];
  const titleSlug = questionSummary.titleSlug;

  const data = useQuery([`${titleSlug}-attempts`], async () => {
    const res = await Axios.get<Attempt[] | undefined>(
      `/attempt/${titleSlug}`
    ).then((res) => res.data);
    return res;
  });
  return data.isLoading || !data.data ? (
    <LoadingLayout />
  ) : (
    <div className="flex h-full w-full flex-col px-4 py-3 md:max-w-[50vw]">
      <BigHeading className="mb-12">Attempts</BigHeading>
      <Table data={data.data} columns={createColumns()} />
    </div>
  );
};

export { AttemptPanel };
