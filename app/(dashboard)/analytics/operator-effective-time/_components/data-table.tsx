"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    generatePDF:any
}

export function DataTable<TData, TValue>({
    columns,
    data,generatePDF
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [selectedDate, setSelectedDate] = React.useState<string>("")
    const [filteredData, setFilteredData] = React.useState<TData[]>(data)

    const table = useReactTable({
        data: filteredData,  // Pass filtered data here
        columns,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })

    const handleFilterByDate = () => {
        if (!selectedDate) {
            setFilteredData(data)  // Reset to original data if no date is selected
            return
        }

        const filtered = data.filter((row: any) => {
            const logintimestamp=new Date(row.loginTimestamp)
            const rowDate = new Date(row.date)
            const filterDate = new Date(selectedDate)
            return (
                logintimestamp.getFullYear() === filterDate.getFullYear() &&
                logintimestamp.getMonth() === filterDate.getMonth() &&
                logintimestamp.getDate() === filterDate.getDate()
            )
        })

        setFilteredData(filtered)
    }

    console.log("dataaaaaaa",data)
    return (
        <>
            <div className='mb-4 border px-12 pt-6 pb-10 rounded-lg bg-slate-100'>
               <div className="w-full flex flex-col lg:flex-row items-end gap-6 mt-4">
                <Input 
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="max-w-sm"
                />
                <Button onClick={handleFilterByDate}>
                    Filter by Date
                </Button>
                <Button onClick={generatePDF}>Download as PDF</Button>
               </div>
            </div>

            <div className="rounded-md border bg-white box-shadow">
                <Table>
                    <TableHeader className="bg-slate-50 py-8">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-white"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="bg-white"
                >
                    Next
                </Button>
            </div> */}
        </>
    )
}
