import { ObbOperation, ObbSheet, Operation, SewingMachine, Staff } from "@prisma/client";

import AddObbOperationForm from "@/components/dashboard/forms/add-obb-operation-form";
import CreateObbSheetForm from "@/components/dashboard/forms/create-obb-sheet-form";
import { db } from "@/lib/db";

interface CategorizedStaff {
  [key: string]: Staff[];
}

const ObbSheetId = async ({
  params
}: {
  params: { obbSheetId: string }
}) => {
  const units = await db.unit.findMany({
    select: {
      name: true,
      id: true,
    }
  });

  const staffs: Staff[] | null = await db.staff.findMany();

  const categorizedStaff: CategorizedStaff = staffs.reduce((acc: CategorizedStaff, staff: Staff) => {
    const { designation } = staff;
    if (!acc[designation]) {
      acc[designation] = [];
    }
    acc[designation].push(staff);
    return acc;
  }, {});

  const sheets: ObbSheet | null = await db.obbSheet.findUnique({
    where: {
      id: params.obbSheetId
    }
  });

  const obbOperations = await db.obbSheet.findUnique({
    where: {
      id: params.obbSheetId
    },
    select: {
      obbOperations: {
        include: {
          operation: {
            select: {
              id: true,
              name: true
            }
          },
          sewingMachine: {
            select: {
              id: true,
              brandName: true,
              machineType: true,
              machineId: true
            }
          },
          supervisor: {
            select: {
              id: true,
              name: true,
              employeeId: true
            }
          }
        },
        orderBy: {
          createdAt: 'asc',
        }
      },
      supervisor1: true,
      supervisor2: true
    }
  });
  console.log("OBB", obbOperations);

  const operations: Operation[] | null = await db.operation.findMany();

  let machines: SewingMachine[] | null = null;

  if (sheets?.productionLineId) {
    const machinesForLine = await db.productionLine.findUnique({
      where: {
        id: sheets?.productionLineId
      },
      select: {
        machines: true
      }
    });
  
    machines = machinesForLine?.machines.filter(machine => machine.isAssigned) ?? [];
  }

  return (
    <section className="mt-16 mx-auto max-w-7xl space-y-12">
      <AddObbOperationForm 
        operations={operations}
        machines={machines}
        obbOperations={obbOperations?.obbOperations}
        obbSheetId={params.obbSheetId}
        supervisor1={obbOperations?.supervisor1 || null}
        supervisor2={obbOperations?.supervisor2 || null}
      />
      <div className="space-y-4">
        <div>
          <h2 className="text-slate-800 text-xl font-medium">Update OBB Sheet</h2>
          <p className="text-slate-500 text-sm">You can update the OBB sheet which you created!</p>
        </div>
        <CreateObbSheetForm 
          units={units} 
          mechanics={categorizedStaff?.["mechanics"]}
          supervisor={categorizedStaff?.["supervisor"]}
          qualityInspector={categorizedStaff?.["quality-inspector"]}
          industrialEngineer={categorizedStaff?.["industrial-engineer"]}
          accessoriesInputMan={categorizedStaff?.["accessories-input-man"]}
          fabricInputMan={categorizedStaff?.["fabric-input-man"]} 
          initialData={sheets}
          obbSheetId={params.obbSheetId}
        />
      </div>
    </section>
  )
}

export default ObbSheetId