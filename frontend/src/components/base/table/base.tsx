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
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [tableData] = React.useState<T[]>([...data]);

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
      </div>
    </div>
  );
};

export { Table };
