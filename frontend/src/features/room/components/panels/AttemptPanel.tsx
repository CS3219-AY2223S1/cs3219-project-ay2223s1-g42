import { useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDistance } from "date-fns";

import {
  Attempt,
  FlattenedQuestionSummary,
  GetAttemptsResponse,
} from "shared/api";
import { Table, LoadingLayout, BaseLink } from "src/components";
import { Axios } from "src/services";

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
        return (
          <BaseLink to={href} className="border-b-[1px] border-b-neutral-900">
            View details
          </BaseLink>
        );
      },
      id: "titleSlug",
      header: "Details",
      maxSize: 500,
      enableSorting: false,
    }),
  ];
  return columns;
};

const AttemptPanel = ({
  questionSummary,
}: {
  questionSummary: FlattenedQuestionSummary;
}) => {
  const titleSlug = questionSummary.titleSlug;
  const data = useQuery([`${titleSlug}-attempts`], async () => {
    const res = await Axios.get<GetAttemptsResponse>(
      `/attempt/${titleSlug}`
    ).then((res) => res.data);
    if (!Array.isArray(res)) {
      return [res];
    }
    return res;
  });
  return (
    <>
      {data.isLoading || !data.data ? (
        <LoadingLayout />
      ) : (
        <div className="px-4 py-3 text-center">
          {data.data.length === 0 ? (
            <div className="font-semibold">
              No past attempts for{" "}
              <span className="font-bold">{questionSummary.title}</span>
            </div>
          ) : (
            <Table data={data.data} columns={createColumns()} />
          )}
        </div>
      )}
    </>
  );
};

export { AttemptPanel };
