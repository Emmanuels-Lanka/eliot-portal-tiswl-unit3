import ShowProductionLines from "@/components/dashboard/common/show-production-lines";
import AddProductionLineForm from "@/components/dashboard/forms/add-production-line-form";
import { db } from "@/lib/db";

const CreateNewProductionLine = async () => {
    const units = await db.unit.findMany({
        select: {
            id: true,
            name: true,
        }
    });

    return (
        <div className='mx-auto max-w-7xl my-16 px-8 pt-6 pb-8 border rounded-lg bg-slate-50'>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <h2 className="text-dark font-medium text-xl">Manage the production lines for the Unit</h2>
                    <p className="mt-1 text-slate-500 text-sm">Select the production unit and manage the lines</p>
                </div>
                <AddProductionLineForm units={units} />
            </div>
            <div className="mt-8">
                <ShowProductionLines units={units} />
            </div>
        </div>
    )
}

export default CreateNewProductionLine