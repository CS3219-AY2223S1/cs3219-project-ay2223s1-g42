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
<<<<<<< HEAD
import {
  LeftArrowIcon,
  RightArrowIcon,
  PrimaryButton,
  SortIcon,
  ChevronDownIcon,
} from "src/components";

type Props<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
};

const Table = <T,>({ columns, data }: Props<T>) => {
=======

type Props<T> = {
  columns: ColumnDef<T, any>[];
  data: T[];
};

const Table = <T,>({ columns, data }: Props<T>) => {
  const rerender = React.useReducer(() => ({}), {})[1];
>>>>>>> Change table src structure
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tableData] = React.useState<T[]>([...data]);

<<<<<<< HEAD
<<<<<<< HEAD
=======
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
>>>>>>> fix: change BE endpoint to use 'questions'
=======
  const [tableData] = React.useState<T[]>([...data]);

>>>>>>> Change table src structure
  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const getPageStart = () => {
    return (
      table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize +
      1
    );
  };

  const getPageEnd = () => {
    return (
      table.getState().pagination.pageIndex *
        table.getState().pagination.pageSize +
      table.getRowModel().rows.length
    );
  };
  return (
    <div>
      <div className="m-2 flex items-center justify-between">
        <span className="text-sm text-neutral-700">
<<<<<<< HEAD
          Showing{" "}
          <span className="font-bold text-neutral-900">{getPageStart()}</span>{" "}
          to <span className="font-bold text-neutral-900">{getPageEnd()}</span>{" "}
          of <span className="font-bold text-neutral-900">{data.length}</span>{" "}
          questions
        </span>
        <div className="mt-2 inline-flex gap-1 xs:mt-0">
          <PrimaryButton
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <div className="flex flex-row items-center gap-1 md:gap-3">
              <LeftArrowIcon className="h-5 w-5" />
              Prev
            </div>
          </PrimaryButton>
          <PrimaryButton
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <div className="flex flex-row items-center gap-1 md:gap-3">
              Next
              <RightArrowIcon className="h-5 w-5" />
            </div>
          </PrimaryButton>
=======
          Showing <span className="font-bold text-neutral-900">1</span> to{" "}
          <span className="font-bold text-neutral-900">10</span> of{" "}
          <span className="font-bold text-neutral-900">100</span> Entries
        </span>
        <div className="mt-2 inline-flex xs:mt-0">
          <button className="inline-flex items-center rounded-l bg-gray-800 py-2 px-4 text-sm font-medium text-white hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg
              aria-hidden="true"
              className="mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            Prev
          </button>
          <button className="inline-flex items-center rounded-r border-0 border-l border-gray-700 bg-gray-800 py-2 px-4 text-sm font-medium text-white hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            Next
            <svg
              aria-hidden="true"
              className="ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
>>>>>>> Change table src structure
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      scope="col"
                      className="py-3 px-6"
                    >
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
<<<<<<< HEAD
                          {(header.column.getCanSort() &&
                            {
                              //TODO: use chevron icon
                              asc: (
                                <ChevronDownIcon className="h-3 w-3 rotate-180 transform" />
                              ),
                              desc: <ChevronDownIcon className="h-3 w-3" />,
                            }[header.column.getIsSorted() as string]) ?? (
                            <SortIcon className="h-3 w-3" />
                          )}
=======
                          {{
                            //TODO: use chevron?
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
>>>>>>> Change table src structure
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
                <tr
                  key={row.id}
                  className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="py-4 px-6">
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
<<<<<<< HEAD
=======
      </div>
      {/* shows number of visible rows */}
      <div>{table.getRowModel().rows.length} Rows</div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      {/* gets data from backend (5 qns currently) */}
      <div>
        <button onClick={() => table.nextPage()}>Refresh Data</button>
>>>>>>> Change table src structure
      </div>
    </div>
  );
};

export { Table };
