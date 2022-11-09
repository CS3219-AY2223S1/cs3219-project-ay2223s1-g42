import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDistance } from "date-fns";

import { Attempt } from "shared/api";
import { Table, BigHeading, LoadingLayout, PrimaryLink } from "src/components";
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

const UserAttemptTable = () => {
  const data = useQuery(["attempts"], async () => {
    const res = await Axios.get<Attempt[] | undefined>("/attempt").then(
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

export { UserAttemptTable };
