import AddFactoryStaffForm from "@/components/dashboard/forms/add-factory-staff-form";
import { db } from "@/lib/db"

const EliotDeviceId = async ({
    params
}: {
    params: { staffId: string }
}) => {
    const staff = await db.staff.findUnique({
        where: {
            id: params.staffId
        }
    });
    
    return <AddFactoryStaffForm staffId={params.staffId} initialData={staff}/>
}

export default EliotDeviceId