"use server";

import { db } from "@/lib/db";

export type MachineSummaryData = {
  machineType: string;
  totalMachines: number;
  assignedCount: number;
  unassignedCount: number;
  lineAssignments: {
    lineName: string;
    count: number;
  }[];
};

export async function fetchMachineSummary(unitId: string): Promise<MachineSummaryData[]> {

  const productionLines = await db.productionLine.findMany({
    where: { unitId },
    select: { id: true, name: true }
  });

  // Get all sewing machines for the unit
  const sewingMachines = await db.sewingMachine.findMany({
    where: { unitId },
    include: {
      productionLines: {
        select: {
          name: true
        }
      }
    }
  });

  // Group by machine type
  const groupedByType = sewingMachines.reduce((acc, machine) => {
    if (!acc[machine.machineType]) {
      acc[machine.machineType] = {
        machineType: machine.machineType,
        totalMachines: 0,
        assignedCount: 0,
        unassignedCount: 0,
        lineAssignments: productionLines.map(line => ({
          lineName: line.name,
          count: 0
        }))
      };
    }

    acc[machine.machineType].totalMachines++;
    
    if (machine.isAssigned) {
      acc[machine.machineType].assignedCount++;
      // Find which line this machine is assigned to
      if (machine.productionLines.length > 0) {
        const lineName = machine.productionLines[0].name;
        const lineAssignment = acc[machine.machineType].lineAssignments.find(
          la => la.lineName === lineName
        );
        if (lineAssignment) {
          lineAssignment.count++;
        }
      }
    } else {
      acc[machine.machineType].unassignedCount++;
    }

    return acc;
  }, {} as Record<string, MachineSummaryData>);

  return Object.values(groupedByType);
}