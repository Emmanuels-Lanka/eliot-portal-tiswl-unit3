"use client"

import { useState } from "react";
import { ArrowUpDown, MoreHorizontal, Loader2, Trash2, Edit } from "lucide-react";
import axios from "axios";
import { EliotDevice } from "@prisma/client"
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils";
import ConfirmModel from "@/components/model/confirm-model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

const ActionCell = ({ row }: { row: any }) => {
    const { id } = row.original;        // temperature id

    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async (temperatureId: string) => {
        //   try {
        //     setIsLoading(true);
        //     await axios.delete(`/api/shops/temperature/${temperatureId}`);
        //     router.refresh();
        //     toast({
        //       title: "Successfully removed temperature!",
        //       variant: 'success',
        //     });
        //   } catch (error: any) {
        //     toast({
        //       title: "⚠️ Something went wrong 👎",
        //       variant: 'error',
        //       description: (
        //         <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
        //           <code className="text-slate-800">
        //             ERROR: {error.message}
        //           </code>
        //         </div>
        //       ),
        //     });
        //   } finally {
        //     setIsLoading(false);
        //   }
    }

    return (
        <div className="flex gap-2">
            <Link href={`/eliot-devices/${id}`}>
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

export const columns: ColumnDef<EliotDevice>[] = [
    {
        accessorKey: "serialNumber",
        header: "Serial No.",
    },
    {
        accessorKey: "modelNumber",
        header: "Model No.",
    },
    {
        accessorKey: "isAssigned",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const isAssigned = row.getValue("isAssigned") || false;

            return (
                <Badge className={cn(
                    "bg-green-600 font-normal",
                    isAssigned && "bg-orange-600"
                )}>
                    {isAssigned ? "Assigned" : "Available"}
                </Badge>
            )
        }
    },
    {
        accessorKey: "installedDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-6"
                >
                    Installed Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date: string = row.getValue("installedDate");
            const formattedDate = date.split('T')[0];

            return (
                <p>{formattedDate}</p>
            )
        }
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => <ActionCell row={row} />
    }
]
