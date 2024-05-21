import { SewingMachine, Unit } from "@prisma/client";

import SelectProductionLineByUnit from "@/components/dashboard/common/select-production-line-by-unit";
import AssignMachine from "@/components/dashboard/common/assign-machine";
import { db } from "@/lib/db";

interface ProductionLinesProps {
  searchParams: {
    unitId: string;
    lineId: string;
  }
}

const ProductionLines = async ({
  searchParams
}: ProductionLinesProps) => {
  const units: Unit[] | null = await db.unit.findMany();

  let assignedMachines: SewingMachine[] | null = null;
  let unassignedMachines: SewingMachine[] | null = null;

  if (searchParams.lineId && searchParams.unitId) {
    try {
      unassignedMachines = await db.sewingMachine.findMany({
        where: {
          isAssigned: false,
          unitId: searchParams.unitId,
        }
      });

      const machinesForLine = await db.productionLine.findUnique({
        where: {
          id: searchParams.lineId
        },
        select: {
          machines: true
        }
      });

      assignedMachines = machinesForLine?.machines.filter(machine => machine.isAssigned) ?? [];
    } catch (error) {
      console.error("[FETCH_MACHINE_DATA_ERROR]", error);
    }
  }

  return (
    <section className="mt-16 space-y-12">
      <SelectProductionLineByUnit units={units} />
      <div className="mx-auto max-w-7xl">
        <AssignMachine
          assignedMachines={assignedMachines}
          unassignedMachines={unassignedMachines}
          lineId={searchParams.lineId}
        />
        {searchParams.lineId &&
          <p className="mt-2 text-sm italic text-slate-500/80">Click the label to assign / unassign the machines.</p>
        }
      </div>
    </section>
  )
}

export default ProductionLines