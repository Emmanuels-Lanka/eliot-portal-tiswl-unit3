import { db } from "@/lib/db";
import MachineSummaryTable from "./_components/machineSummaryTable";

export default async function MachineSummaryPage() {
  const units = await db.unit.findMany({
    orderBy: { name : "asc" },
    select: { id: true, name: true }
  });

  return (
    <div className="container">
      <MachineSummaryTable units={units} />
    </div>
  );
}