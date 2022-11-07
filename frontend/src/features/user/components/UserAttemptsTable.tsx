import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDistance } from "date-fns";

import { Attempt } from "shared/api";
import { Table, BigHeading, LoadingLayout } from "src/components";
import { Axios } from "src/services";

function formatDate(date: Date) {
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
}

const createColumns = () => {
  const columnHelper = createColumnHelper<Attempt>();

  const columns = [
    columnHelper.accessor("title", {
      cell: (info) => info.getValue(),
      id: "title",
      header: "Question",
      size: 120,
    }),
    columnHelper.accessor("updatedAt", {
      cell: (info) => formatDate(info.getValue()),
      header: "Last updated",
    }),
    columnHelper.accessor("content", {
      cell: (info) => info.getValue(),
      id: "content",
      header: "Details",
      maxSize: 500,
      enableSorting: false,
    }),
  ];
  return columns;
};

const UserAttemptsTable = () => {
  const data = useQuery(["attempts"], async () => {
    const res = await Axios.get<Attempt[] | undefined>("/attempts").then(
      (res) => res.data
    );
    return res;
  });

  return (
    <div>
      {data.isLoading || !data.data ? (
        <LoadingLayout />
      ) : (
        <>
          <BigHeading className="mb-12">Attempts</BigHeading>
          <Table data={data.data} columns={createColumns()} />
        </>
      )}
    </div>
  );
};

export { UserAttemptsTable };
