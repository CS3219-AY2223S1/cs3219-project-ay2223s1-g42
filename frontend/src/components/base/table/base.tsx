import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import cx from "classnames";

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
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
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
    <div className="flex w-auto flex-col gap-3 bg-red-400">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-700">
          Showing{" "}
          <span className="font-bold text-neutral-900">{getPageStart()}</span>{" "}
          to <span className="font-bold text-neutral-900">{getPageEnd()}</span>{" "}
          of <span className="font-bold text-neutral-900">{data.length}</span>{" "}
          questions
        </span>
        <div className="mt-2 inline-flex gap-3">
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
      <div className="relative overflow-x-auto bg-green-400">
        <table className="w-full border-[1px] border-neutral-900 text-left text-sm ">
          <thead className="bg-neutral-900 text-xs uppercase tracking-wider text-neutral-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    scope="col"
                    className="py-3 px-6"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cx("flex flex-row items-center gap-1", {
                          "cursor-pointer select-none":
                            header.column.getCanSort(),
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() ? (
                          !header.column.getIsSorted() ? (
                            <span className="h-4 w-4" />
                          ) : header.column.getIsSorted() === "asc" ? (
                            <ChevronDownIcon className="h-4 w-4 rotate-180 transform stroke-[3px]" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4 transform stroke-[3px]" />
                          )
                        ) : (
                          <SortIcon className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr
                  key={row.id}
                  className="w-full border-b-[1px] border-neutral-900 bg-neutral-100 md:min-w-max"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        className="bg-purple-400 py-2 px-3 text-base lg:min-h-[100px] lg:min-w-[200px] lg:py-3 lg:px-4"
                      >
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
