import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDistance } from "date-fns";

import { Attempt, GetSummariesResponse } from "shared/api";
import { Table, LoadingLayout, PrimaryLink } from "src/components";
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
    columnHelper.accessor("titleSlug", {
      cell: (info) => {
        const slug = info.getValue();
        const href = `/question?slug=${slug}`;
        return <PrimaryLink to={href}>View details</PrimaryLink>;
      },
      id: "titleSlug",
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
      <Table data={data.data} columns={createColumns()} />
    </div>
  );
};

export { AttemptPanel };
