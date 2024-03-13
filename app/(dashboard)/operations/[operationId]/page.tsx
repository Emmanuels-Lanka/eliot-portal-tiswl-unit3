import AddOperation from "@/components/dashboard/forms/add-operation";
import { db } from "@/lib/db"

const OperationId = async ({
    params
}: {
    params: { operationId: string }
}) => {
    const operation = await db.operation.findUnique({
        where: {
            id: params.operationId
        }
    });
    
    return <AddOperation operationId={params.operationId} initialData={operation}/>
}

export default OperationId