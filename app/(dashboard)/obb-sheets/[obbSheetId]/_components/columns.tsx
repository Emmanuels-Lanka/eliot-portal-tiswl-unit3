"use client"

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Loader2, Trash2, Edit } from "lucide-react";
import axios from "axios";
import { ObbOperation } from "@prisma/client"
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils";
import ConfirmModel from "@/components/model/confirm-model";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ActionCell = ({ row }: { row: any }) => {
    const { id } = row.original;

    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

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
            <Link href={`/obb-sheets/${id}`}>
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

export const columns: ColumnDef<ObbOperation>[] = [
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
        header: "Machine",
        cell: ({ row }) => {
            const machineId: string = row.getValue("sewingMachine.machineId") || "";
            const machineType: string = row.getValue("sewingMachine.machineType") || "";
            const brandName: string = row.getValue("sewingMachine.brandName") || "";

            const machineName = `${brandName}-${machineType}-${machineId}`;

            return (
                <div>
                    {machineId ? machineName : "-"}
                </div>
            )
        }
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
