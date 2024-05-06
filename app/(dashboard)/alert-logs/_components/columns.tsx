"use client"

import { ArrowUpDown } from "lucide-react";
import { AlertLog } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "../../../../lib/utils";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
// import { Button } from "../../../../components/ui/button";

export const columns: ColumnDef<AlertLog>[] = [
    {
        accessorKey: "operatorRfid",
        header: "Alert From (RFID)",
    },
    {
        accessorKey: "employeeId",
        header: "Alert To (ID)",
    },
    {
        accessorKey: "machineId",
        header: "Machine ID",
    },
    {
        accessorKey: "alertType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Alert Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("alertType");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    {
        accessorKey: "smsStatus",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-6"
                >
                    SMS Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status: string = row.getValue("smsStatus");

            return (
                <Badge className={cn(
                    "bg-green-600 font-normal",
                    status === 'SENDING' ? "bg-orange-600" : status === 'FAILED' && "bg-red-600"
                )}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "emailStatus",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-6"
                >
                    Email Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status: string = row.getValue("emailStatus");

            return (
                <Badge className={cn(
                    "bg-green-600 font-normal",
                    status === 'SENDING' ? "bg-orange-600" : status === 'FAILED' && "bg-red-600"
                )}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "timestamp",
        header: "Date & Time",
    },
]
