"use client";

import * as React from "react";
import { useState, useTransition, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";

// Pagination සඳහා Icons සහ Select components
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const parseDateInLocalTimezone = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

type PdfDataRow = {
  operator: { name: string; employeeId: string } | null;
  lineName: string;
  machineId: string;
  loginTimestamp: string;
  logoutTimestamp: string | null;
  effectiveTime: string | null;
  nonEffectiveTime: string | null;
};

export function DataTable<TData extends PdfDataRow, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [displayDate, setDisplayDate] = useState<Date | undefined>(() => {
    const dateFromUrl = searchParams.get("date");
    return dateFromUrl ? parseDateInLocalTimezone(dateFromUrl) : undefined;
  });

  useEffect(() => {
    const dateFromUrl = searchParams.get("date");
    setDisplayDate(
      dateFromUrl ? parseDateInLocalTimezone(dateFromUrl) : undefined
    );
  }, [searchParams]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleDateChange = (date: Date | undefined) => {
    setDisplayDate(date);
    const params = new URLSearchParams(searchParams);
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      params.set("date", formattedDate);
    } else {
      params.delete("date");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text("Operator Effective Time Report", 14, 15);
    doc.setFontSize(10);
    doc.text(
      `Date: ${displayDate ? displayDate.toLocaleDateString() : "All"}`,
      14,
      20
    );

    const tableHeaders = [
      "Operator Name",
      "Emp ID",
      "Line Name",
      "Machine NO",
      "Login Time",
      "Logout Time",
      "Productive Time",
      "Non-Productive Time",
    ];

    const tableData = table.getFilteredRowModel().rows.map((row) => {
      const original = row.original;
      const loginTime = original.loginTimestamp
        ? new Date(original.loginTimestamp).toLocaleString()
        : "N/A";
      const logoutTime = original.logoutTimestamp
        ? new Date(original.logoutTimestamp).toLocaleString()
        : "N/A";

      return [
        original.operator?.name || "N/A",
        original.operator?.employeeId || "N/A",
        original.lineName,
        original.machineId,
        loginTime,
        logoutTime,
        original.effectiveTime || "N/A",
        original.nonEffectiveTime || "N/A",
      ];
    });

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 25,
      theme: "grid",
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [0, 150, 255],
        textColor: [80, 80, 80],
        fontSize: 9,
      },
    });

    doc.save(
      `Operator_Effective_Time_${searchParams.get("date") || "report"}.pdf`
    );
  };

  return (
    <>
      <div className="mb-4 border px-8 pt-6 pb-8 rounded-lg bg-slate-100">
        <div className="flex items-center gap-4 flex-wrap">
          <Input
            placeholder="Search all columns..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
          <DatePicker date={displayDate} setDate={handleDateChange} />
          <Button onClick={generatePDF} className="ml-auto">
            Download as PDF
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white box-shadow">
        <Table>
          <TableHeader className="bg-slate-50 py-8">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading new data...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found for the selected date.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4 px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) available.
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 50, 100, 200, 400].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
