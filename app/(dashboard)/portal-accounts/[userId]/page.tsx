import AddPortalAccountUserForm from "@/components/dashboard/forms/add-portal-account-user-form";
import { db } from "@/lib/db"

const EliotDeviceId = async ({
    params
}: {
    params: { userId: string }
}) => {
    const user = await db.user.findUnique({
        where: {
            id: params.userId
        }
    });
    
    return <AddPortalAccountUserForm userId={params.userId} initialData={user}/>
}

export default EliotDeviceId