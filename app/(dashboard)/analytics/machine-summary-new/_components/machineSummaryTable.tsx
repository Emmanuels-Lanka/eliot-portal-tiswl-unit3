"use client";

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchMachineSummary } from "../_components/action";
import { MachineSummaryData } from "../_components/action";

interface MachineSummaryTableProps {
  units: {
    id: string;
    name: string;
  }[];
}

export default function MachineSummaryTable({ units }: MachineSummaryTableProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [machineData, setMachineData] = useState<MachineSummaryData[]>([]);
  const [lineNames, setLineNames] = useState<string[]>([]);

  const handleUnitChange = async (unitId: string) => {
    setSelectedUnit(unitId);
    setLoading(true);
    
    try {
      const data = await fetchMachineSummary(unitId);
      setMachineData(data);
      
      // Extract unique line names from the data
      if (data.length > 0) {
        const lines = data[0].lineAssignments.map(la => la.lineName);
        setLineNames(lines);
      }
    } catch (error) {
      console.error("Failed to fetch machine summary:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 mt-10 mb-12">
    <div className="space-y-4">
        <h3 className="font-medium text-slate-600">Select a unit</h3>
        <Select onValueChange={handleUnitChange} disabled={loading}>
          <SelectTrigger className="bg-white w-[300px]">
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      </div>

      {loading && <div>Loading...</div>}

      {!loading && machineData.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2}>M/C Type</TableHead>
                <TableHead rowSpan={2}>No of M/C in Unit</TableHead>
                <TableHead colSpan={lineNames.length} className="text-center">
                  Assigned M/C
                </TableHead>
                <TableHead rowSpan={2}>Un Assigned M/C</TableHead>
              </TableRow>
              <TableRow>
                {lineNames.map((lineName) => (
                  <TableHead key={lineName} className="text-center">
                    {lineName}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {machineData.map((data) => (
                <TableRow key={data.machineType}>
                  <TableCell>{data.machineType}</TableCell>
                  <TableCell className="text-center">{data.totalMachines}</TableCell>
                  {lineNames.map((lineName) => {
                    const lineAssignment = data.lineAssignments.find(
                      la => la.lineName === lineName
                    );
                    return (
                      <TableCell key={lineName} className="text-center">
                        {lineAssignment?.count || 0}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">{data.unassignedCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}