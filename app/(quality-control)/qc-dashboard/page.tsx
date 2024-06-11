import { SewingMachine, Unit } from '@prisma/client';
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import moment from 'moment-timezone';

import { db } from '@/lib/db';
import SelectProductionLineByUnit from '@/components/dashboard/common/select-production-line-by-unit';
import AddQCRecordForm from '@/components/dashboard/forms/add-qc-record-form';

interface QCDashboardProps {
    searchParams: {
        lineId: string;
    }
}

const QCDashboard = async ({
    searchParams
}: QCDashboardProps) => {
    const cookieStore = cookies();
    const token = cookieStore.get('AUTH_TOKEN');

    if (!token) {
        return redirect('/sign-in');
    }

    const { value } = token;
    const secret = process.env.JWT_SECRET || "";

    let verifiedUser = verify(value, secret) as JwtPayload;

    const units: Unit[] | null = await db.unit.findMany();

    let machines: SewingMachine[] | null = null;

    if (searchParams.lineId) {
        try {
            const machinesForLine = await db.productionLine.findUnique({
                where: {
                    id: searchParams.lineId,
                },
                select: {
                    machines: true
                }
            });

            machines = machinesForLine?.machines.filter(machine => machine.isAssigned) ?? [];
        } catch (error) {
            console.error("[FETCH_MACHINE_DATA_ERROR]", error);
        }
    }

    return (
        <section className="mt-16 space-y-12 mb-2">
            <SelectProductionLineByUnit units={units} />
            <div className="mx-auto max-w-7xl">
                {machines !== null ?
                    <AddQCRecordForm 
                        machines={machines}
                        qcEmail={verifiedUser.email}
                    />
                :
                    <p className="mt-2 text-sm italic text-slate-500/80">Please select the Unit and Line above.☝️</p>
                }
                {searchParams.lineId &&
                    <p className="mt-2 text-sm italic text-slate-500/80">Please fill the details and click Save</p>
                }
            </div>
        </section>
    )
}

export default QCDashboard