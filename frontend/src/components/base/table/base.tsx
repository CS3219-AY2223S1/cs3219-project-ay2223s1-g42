import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Axios } from "src/services";

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
  columns: ColumnDef<QuestionSummary, any>[];
  data: QuestionSummary[];
};

const Table = ({ columns, data }: Props) => {
  const rerender = React.useReducer(() => ({}), {})[1];
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [qnData, setQnData] = React.useState<QuestionSummary[]>([...data]);

  // TODO: Change endpoint if needed
  const refreshData = () => {
    async function getData() {
      // await Axios.get<QuestionSummary[]>(
      //   "questions/?topicTags=breadth-first-search,HASH-TABLE  ,  ,  sTriNG&topicMatch=AND"
      // ).then(({ data }) => {
      //   setQnData(data);
      // });
      await Axios.get<QuestionSummary[]>("questions/").then(({ data }) => {
        setQnData(data);
      });
    }
    getData();
  };
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
                          //TODO: use chevron?
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
      {/* shows number of visible rows */}
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      {/* gets data from backend (5 qns currently) */}
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
      {/* shows sorting fn applied on which column */}
      <pre>{JSON.stringify(sorting, null, 2)}</pre>
    </div>
  );
};

export { Table };
