"use client"

import * as React from "react"
import { Edit, Loader2, Trash2 } from "lucide-react"
import axios from "axios";
import { useRouter } from "next/navigation";
import { ObbOperation } from "@prisma/client"
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
import { Checkbox } from "@/components/ui/checkbox"
import ConfirmModel from "@/components/model/confirm-model"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast";

interface DataTableProps<TData, TValue> {
    data: TData[];
    handleEdit: (data: ObbOperation) => void;
}

export function DataTable<TData, TValue>({
    data,
    handleEdit
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})

    // From the `columns.tsx` file
    const ActionCell = ({ row }: { row: any }) => {
        const { id } = row.original;

        const { toast } = useToast();
        const router = useRouter();

        const [isLoading, setIsLoading] = React.useState(false);

        const onDelete = async (obbOperationId: string) => {
            try {
                setIsLoading(true);
                await axios.delete(`/api/obb-operation/${obbOperationId}`);
                router.refresh();
                toast({
                    title: "Successfully removed OBB operation!",
                    variant: 'success',
                });
            } catch (error: any) {
                if (error.response && error.response.status === 409) {
                    toast({
                        title: error.response.data,
                        variant: "error"
                    });
                } else {
                    toast({
                        title: "Something went wrong! Try again",
                        variant: "error",
                        description: (
                            <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                                <code className="text-slate-800">
                                    ERROR: {error.message}
                                </code>
                            </div>
                        ),
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }

        return (
            <div className="flex gap-2">
                <Button
                    size='sm'
                    disabled={isLoading}
                    variant='outline'
                    onClick={() => handleEdit(row.original)}
                >
                    <Edit className="w-4 h-4" />
                </Button>
                <ConfirmModel onConfirm={() => onDelete(id)}>
                    <Button
                        size='sm'
                        disabled={isLoading}
                        variant='outline'
                    >
                        <Loader2 className={cn("animate-spin w-4 h-4 hidden", isLoading && "flex")} />
                        <Trash2 className={cn("w-4 h-4 text-destructive", isLoading && 'hidden')} />
                    </Button>
                </ConfirmModel>
            </div>
        )
    }

    const columns: ColumnDef<ObbOperation | any>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value: any) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "seqNo",
            header: "Seq No",
        },
        {
            accessorKey: "operation.name",
            header: "Operation",
        },
        {
            accessorKey: "sewingMachine.machineId",
            header: "Machine"
        },
        {
            accessorKey: "supervisor.name",
            header: "Supervisor",
        },
        {
            accessorKey: "smv",
            header: "SMV",
        },
        {
            accessorKey: "target",
            header: "Target",
        },
        {
            accessorKey: "spi",
            header: "SPI",
        },
        {
            accessorKey: "length",
            header: "Length",
        },
        {
            accessorKey: "totalStitches",
            header: "Stitches",
        },
        {
            id: "actions",
            header: "Action",
            cell: ({ row }) => <ActionCell row={row} />
        }
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })

    return (
        <div>
            {/* Search bar */}
            {/* <div className="flex items-center py-4">
                <Input
                    placeholder="Search Seq No..."
                    value={(table.getColumn("seqNo")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("seqNo")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div> */}

            {/* Table */}
            <div className="rounded-md border bg-white/50 mt-4">
                <Table>
                    <TableHeader className="bg-slate-50">
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

            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
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
            </div>
        </div>
    )
}
