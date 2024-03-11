"use client"

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Loader2, Trash2, Edit } from "lucide-react";
import axios from "axios";
import { SewingMachine } from "@prisma/client"
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils";
import ConfirmModel from "@/components/model/confirm-model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ActionCell = ({ row }: { row: any }) => {
    const { id } = row.original;

    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async (machineId: string) => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/sewing-machine/${machineId}`);
            router.refresh();
            toast({
                title: "Successfully removed device!",
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
            <Link href={`/sewing-machines/${id}`}>
                <Button
                    size='sm'
                    disabled={isLoading}
                    variant='outline'
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </Link>
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

export const columns: ColumnDef<SewingMachine>[] = [
    {
        accessorKey: "serialNumber",
        header: "Serial No.",
    },
    {
        accessorKey: "brandName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-4"
                >
                    Brand Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "machineType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("machineType");
            return (
                <p className="uppercase">{value}</p>
            )
        }
    },
    {
        accessorKey: "machineId",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    // {
    //     accessorKey: "isAssigned",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //                 className="-ml-3"
    //             >
    //                 Status
    //                 <ArrowUpDown className="ml-2 h-4 w-4" />
    //             </Button>
    //         )
    //     },
    //     cell: ({ row }) => {
    //         const isAssigned = row.getValue("isAssigned") || false;

    //         return (
    //             <Badge className={cn(
    //                 "bg-green-600 font-normal",
    //                 isAssigned && "bg-orange-600"
    //             )}>
    //                 {isAssigned ? "Assigned" : "Available"}
    //             </Badge>
    //         )
    //     }
    // },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => <ActionCell row={row} />
    }
]
