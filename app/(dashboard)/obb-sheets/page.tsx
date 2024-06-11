import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";


const ObbSheet = async () => {
  const sheets = await db.obbSheet.findMany({
    include: {
      unit: true,
      productionLine: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className='mx-auto max-w-7xl mt-12'>
      <DataTable columns={columns} data={sheets} />
    </div>
  )
}

export default ObbSheet