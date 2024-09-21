import { db } from '@/lib/db';
import AddLineEfficiencyResourcesForm from './_components/add-line-efficiency-resources-form';

const LineEfficiencyResurces = async () => {
    const units = await db.unit.findMany({
        orderBy: {
            createdAt: "desc",
        }
    });

    return (
        <div>
            <AddLineEfficiencyResourcesForm
                units={units}
            />
        </div>
    )
}

export default LineEfficiencyResurces