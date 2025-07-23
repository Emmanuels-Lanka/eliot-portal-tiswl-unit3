import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

interface OperatorEffectiveTimePageProps {
  searchParams: {
    date?: string;
  };
}

const OperatorEffectiveTimePage = async ({
  searchParams,
}: OperatorEffectiveTimePageProps) => {
  const todayInUTC = new Date().toISOString().split("T")[0];
  const date = searchParams.date || todayInUTC;

  const operatorEffectiveTimes = await db.operatorEffectiveTime.findMany({
    where: {
      loginTimestamp: {
        startsWith: date,
      },
    },
    include: {
      operator: {
        include: {
          operatorSessions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              obbOperation: {
                include: {
                  sewingMachine: { select: { machineId: true } },
                  obbSheet: {
                    include: {
                      productionLine: { select: { name: true } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      loginTimestamp: "desc",
    },
  });

  const flattenedData = operatorEffectiveTimes.map((record) => {
    const latestSession = record.operator?.operatorSessions[0];
    const machineId = latestSession?.obbOperation?.sewingMachine?.machineId;
    const lineName =
      latestSession?.obbOperation?.obbSheet?.productionLine?.name;

    return {
      ...record,
      operator: record.operator,
      machineId: machineId || "N/A",
      lineName: lineName || "N/A",
    };
  });

  return (
    <div className="mx-auto mt-12 p-4">
      <DataTable columns={columns} data={flattenedData} />
    </div>
  );
};

export default OperatorEffectiveTimePage;
