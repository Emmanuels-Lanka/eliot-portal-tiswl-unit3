// app/your-route/_components/columns.ts

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FlattenedOperatorEffectiveTime = {
  id: string;
  operatorRfid: string;
  loginTimestamp: string;
  logoutTimestamp: string | null;
  totalTime: string | null;
  effectiveTime: string | null;
  nonEffectiveTime: string | null;
  mechanicDownTime: string | null;
  productionDownTime: string | null;
  lunchBreakTime: string | null;
  offStandTime: string | null;
  status: string | null;
  operator: {
    name: string;
    employeeId: string;
  } | null;
  machineId: string;
  lineName: string;
};

export const columns: ColumnDef<FlattenedOperatorEffectiveTime>[] = [
  {
    accessorKey: "operator.name",
    header: "Operator Name",
  },
  {
    accessorKey: "operator.employeeId",
    header: "Emp ID",
  },
  {
    accessorKey: "lineName",
    header: "Line Name",
  },
  {
    accessorKey: "machineId",
    header: "Machine NO",
  },
  {
    accessorKey: "loginTimestamp",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3"
      >
        Login Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("loginTimestamp") as string;
      if (!timestamp) return "N/A";
      return <div>{new Date(timestamp).toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "logoutTimestamp",
    header: "Logout Time",
    cell: ({ row }) => {
      const timestamp = row.getValue("logoutTimestamp") as string;
      if (!timestamp) return "N/A";
      return <div>{new Date(timestamp).toLocaleString()}</div>;
    },
  },
  { accessorKey: "totalTime", header: "Total Available Time" },
  { accessorKey: "mechanicDownTime", header: "Mechanic Down Time" },
  { accessorKey: "productionDownTime", header: "Production Down Time" },
  { accessorKey: "lunchBreakTime", header: "Lunch Break Time" },
  { accessorKey: "offStandTime", header: "Offstand Time" },
  { accessorKey: "nonEffectiveTime", header: "Non-Productive Time" },
  { accessorKey: "effectiveTime", header: "Productive Time" },
];
