"use client"

import * as React from "react";
import { Ban, Edit, Loader2, Sparkle, Trash2, MoreHorizontal } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ObbOperation } from "@prisma/client";
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
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import ConfirmModel from "@/components/model/confirm-model";
import { cn } from "@/lib/utils";
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

        const handleStatus = async (obbOperationId: string) => {
            if (row.original.isActive === true) {
                try {
                    setIsLoading(true);
                    await axios.patch(`/api/obb-operation/${obbOperationId}/deactive`);
                    router.refresh();
                    toast({
                        title: `Successfully deactivated OBB operation!`,
                        variant: "success",
                    });
                } catch (error: any) {
                    console.error("STATUS_DEACTIVATE_ERROR", error);
                    toast({
                        title: error.response.data || "Something went wrong! Try again",
                        variant: "error"
                    });
                }
            } else {
                try {
                    setIsLoading(true);
                    await axios.patch(`/api/obb-operation/${obbOperationId}/active`);
                    router.refresh();
                    toast({
                        title: `Successfully activated OBB operation!`,
                        variant: "success",
                    });
                } catch (error: any) {
                    console.error("STATUS_ACTIVATE_ERROR", error);
                    toast({
                        title: error.response.data || "Something went wrong! Try again",
                        variant: "error"
                    });
                }
            }
            setIsLoading(false);
        }

        return (
            <div className="w-full flex justify-between items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                        <DropdownMenuItem
                            disabled={isLoading}
                            onClick={() => handleEdit(row.original)}
                            className="gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={isLoading}
                            onClick={() => handleStatus(id)}
                            className={cn(
                                "gap-2 font-medium", 
                                row.original.isActive === true ? "text-red-500 hover:text-red-500" : "text-green-600"
                            )}
                        >
                            {row.original.isActive === true ?
                                <Ban className="w-4 h-4" />
                            :
                                <Sparkle className="w-4 h-4" />
                            }
                            {row.original.isActive === true ? "Deactive" : "Active"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ConfirmModel onConfirm={() => onDelete(id)}>
                            <Button
                                size='sm'
                                disabled={isLoading}
                                variant='destructive'
                                className="w-full gap-2 justify-start"
                            >
                                <Loader2 className={cn("animate-spin w-4 h-4 hidden", isLoading && "flex")} />
                                <Trash2 className={cn("w-4 h-4", isLoading && 'hidden')} />
                                Delete
                            </Button>
                        </ConfirmModel>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className={cn("w-2.5 h-2.5 bg-orange-600 rounded-full", row.original.isActive === true && "w-2 h-2 bg-green-600 animate-ping")}/>
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
            accessorFn: (row) => row.operation?.name,
            id: "operation.name",
            header: "Operation",
            cell: (info) => info.getValue() || "-"
        },
        {
            accessorFn: (row) => row.sewingMachine?.machineId,
            id: 'sewingMachine.machineId',
            header: "Machine",
            cell: (info) => info.getValue() || "-"
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
        // {
        //     accessorKey: "spi",
        //     header: "SPI",
        // },
        // {
        //     accessorKey: "length",
        //     header: "Length",
        // },
        // {
        //     accessorKey: "totalStitches",
        //     header: "Stitches",
        // },
        {
            id: "actions",
            header: "Actions",
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
        manualPagination: false,
        initialState: {
            pagination: {
                pageSize: 50
            }
        }
    });

    return (
        <div>
            {/* Search bar */}
            <div className="flex items-center pt-4 space-x-4">
                <Input
                    placeholder="Search Operation..."
                    value={(table.getColumn("operation.name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("operation.name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Input
                    placeholder="Search Machine ID..."
                    value={(table.getColumn("sewingMachine.machineId")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("sewingMachine.machineId")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white/50 mt-4 max-h-[600px] overflow-y-auto">
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
                <span className="text-sm text-slate-500">
                    Page {table.getState().pagination.pageIndex + 1} of {Math.ceil(table.getCoreRowModel().rows.length / table.getState().pagination.pageSize)}
                </span>
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
