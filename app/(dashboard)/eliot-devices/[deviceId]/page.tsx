import AddEliotDeviceForm from "@/components/dashboard/forms/add-eliot-device-form";
import { db } from "@/lib/db"

const EliotDeviceId = async ({
    params
}: {
    params: { deviceId: string }
}) => {
    const device = await db.eliotDevice.findUnique({
        where: {
            id: params.deviceId
        }
    });
    
    return <AddEliotDeviceForm deviceId={params.deviceId} initialData={device}/>
}

export default EliotDeviceId