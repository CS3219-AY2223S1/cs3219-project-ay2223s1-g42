import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

type QuestionSummary = {
  acRate: number;
  difficulty: string;
  title: string;
  discussionLink: string;
  titleSlug: string;
  topicTags: string[];
  createdAt: string;
  updatedAt: string;
};

type Props = {
  columns?: any; // TODO: figure out type
  data?: QuestionSummary[];
};

function stringifyDate(strDate: string) {
  const date = new Date(strDate);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

const columnHelper = createColumnHelper<QuestionSummary>();

const defaultColumns = [
  columnHelper.accessor("title", {
    cell: (info) => info.getValue(),
    id: "title",
    header: "Title",
  }),
  columnHelper.accessor("difficulty", {
    cell: (info) => info.getValue(),
    id: "difficulty",
    header: "Difficulty",
  }),
  columnHelper.accessor("topicTags", {
    cell: (info) =>
      info.getValue().reduce((prev, curr) => {
        return prev + ", " + curr;
      }),
    id: "topicTags",
    header: "Topics",
    enableSorting: false,
  }),
  // TODO: change to hyperlink icon, open in new tab
  columnHelper.accessor("discussionLink", {
    cell: (info) => info.getValue(),
    header: "Discussion",
    enableSorting: false,
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => stringifyDate(info.getValue()),
    header: "Added on",
  }),
];

const defaultQuesitons: QuestionSummary[] = [
  {
    acRate: 32.102882410776,
    difficulty: "Medium",
    title: "3Sum",
    createdAt: "2022-09-23T19:20:36.199Z",
    discussionLink:
      "https://leetcode.com/problems/3sum/discuss/?currentPage=1&orderBy=most_votes&query=",
    topicTags: ["array", "two-pointers", "sorting"],
    titleSlug: "3sum",
    updatedAt: "2022-09-25T15:00:10.440Z",
  },
  {
    acRate: 40.56593028625932,
    difficulty: "Easy",
    title: "Longest Common Prefix",
    createdAt: "2022-09-23T19:20:36.134Z",
    discussionLink:
      "https://leetcode.com/problems/longest-common-prefix/discuss/?currentPage=1&orderBy=most_votes&query=",
    topicTags: ["string"],
    titleSlug: "longest-common-prefix",
    updatedAt: "2022-09-25T15:00:10.358Z",
  },
  {
    acRate: 56.35673953099588,
    difficulty: "Medium",
    title: "Path Sum II",
    createdAt: "2022-09-23T19:20:45.569Z",
    discussionLink:
      "https://leetcode.com/problems/path-sum-ii/discuss/?currentPage=1&orderBy=most_votes&query=",
    topicTags: ["backtracking", "tree", "depth-first-search", "binary-tree"],
    titleSlug: "path-sum-ii",
    updatedAt: "2022-09-25T15:00:19.368Z",
  },
  {
    acRate: 49.06049551975713,
    difficulty: "Easy",
    title: "Two Sum",
    createdAt: "2022-09-23T19:20:34.911Z",
    discussionLink:
      "https://leetcode.com/problems/two-sum/discuss/?currentPage=1&orderBy=most_votes&query=",
    topicTags: ["array", "hash-table"],
    titleSlug: "two-sum",
    updatedAt: "2022-09-25T15:00:09.251Z",
  },
];

const Table = ({
  columns = defaultColumns,
  data = defaultQuesitons,
}: Props) => {
  const rerender = React.useReducer(() => ({}), {})[1];
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [qnData, setQnData] = React.useState<QuestionSummary[]>([data[0]]);

  const refreshData = () => setQnData(() => [...defaultQuesitons]);
  const table = useReactTable({
    data: qnData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div>
      <div />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      <pre>{JSON.stringify(sorting, null, 2)}</pre>
    </div>
  );
};

export { Table };
