import AddSewingOperatorForm from "@/components/dashboard/forms/add-sewing-operator-form";
import { db } from "@/lib/db"

const EliotDeviceId = async ({
    params
}: {
    params: { operatorId: string }
}) => {
    const operator = await db.operator.findUnique({
        where: {
            id: params.operatorId
        }
    });
    
    return <AddSewingOperatorForm operatorId={params.operatorId} initialData={operator}/>
}

export default EliotDeviceId