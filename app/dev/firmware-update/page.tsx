import { db } from '@/lib/db';
import FirmwareUpdateForm from '../_components/firmware-update-form';

const FirmwareUpdatePage = async () => {
    const devices = await db.eliotDevice.findMany();

    return <FirmwareUpdateForm devices={devices}/>
}

export default FirmwareUpdatePage