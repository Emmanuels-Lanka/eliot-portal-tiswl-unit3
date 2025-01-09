import { SewingMachine, Unit } from '@prisma/client';

import { db } from '@/lib/db';
import Multi from '../_components/multi';

const FirmwareUpdatePage = async () => {
    const devices = await db.eliotDevice.findMany();

    return (
        <section>
            <Multi devices={devices}/>
        </section>
    )
}

export default FirmwareUpdatePage