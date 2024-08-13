import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const OperatorEffectiveTime = async () => {
    const effetiveTime = await db.operatorEffectiveTime.findMany({
        include: {
            operator: true
        }
    });

    return (
        <div className='mt-12'>
            <DataTable columns={columns} data={effetiveTime} />
        </div>
    )
}

export default OperatorEffectiveTime