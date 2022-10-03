import { useState, useReducer, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { Axios } from "src/services";

function stringifyDate(strDate: string) {
  const date = new Date(strDate);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

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

const defaultQuestions: QuestionSummary[] = [
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

const columnHelper = createColumnHelper<QuestionSummary>();

const defaultColumns = [
  columnHelper.accessor("title", {
    cell: (info) => info.getValue(),
    id: "title",
    header: "Title",
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("difficulty", {
    cell: (info) => info.getValue(),
    id: "difficulty",
    header: "Difficulty",
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("topicTags", {
    cell: (info) =>
      info.getValue().map((v, i) => <span key={`${v}${i}`}>{v}</span>),
    // cell: (info) =>
    //   info.getValue().reduce((prev, curr) => {
    //     return prev + ", " + curr;
    //   }),
    id: "topicTags",
    header: "Topics",
    enableSorting: false,
  }),
  // TODO: hyperlink badge
  columnHelper.accessor("discussionLink", {
    cell: (info) => {
      const lcLink = info.getValue();
      return (
        <div>
          <a href={lcLink} target="_blank" rel="noopener noreferrer">
            Open in <br />
            LC
          </a>
        </div>
      );
    },
    header: "Discussion",
    enableSorting: false,
  }),
  columnHelper.accessor("createdAt", {
    cell: (info) => stringifyDate(info.getValue()),
    header: "Added on",
  }),
  columnHelper.accessor("updatedAt", {
    cell: (info) => stringifyDate(info.getValue()),
    header: "Last updated",
  }),
];

export default function All() {
  const rerender = useReducer(() => ({}), {})[1];

  const dataQuery = useQuery(
    ["data"],
    () => Axios.get<QuestionSummary[]>("/question").then((res) => res.data),
    {
      keepPreviousData: true,
    }
  );

  const table = useReactTable({
    data: dataQuery.data ?? defaultQuestions,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table className="border-[1px] border-neutral-900">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-[1px] border-neutral-900"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border-r-[1px] border-neutral-900"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, -1)
            .map((row) => (
              <tr key={row.id} className="border-b-[1px] border-neutral-900">
                {row
                  .getVisibleCells()
                  .slice(0, -1)
                  .map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
              </tr>
            ))}
          {/* last row of table */}
          <tr>
            {table
              .getRowModel()
              .rows[table.getRowModel().rows.length - 1].getVisibleCells()
              .slice(0, -1)
              .map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
          </tr>
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  );
}
