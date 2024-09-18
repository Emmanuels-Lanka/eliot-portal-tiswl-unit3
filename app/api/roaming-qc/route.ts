import { NextResponse } from "next/server";
import moment from 'moment-timezone';

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { machineId, unit, lineId, operatorRfid, obbOperationId, defects, inspectedQty, colorStatus } = await req.json();
        console.log("Working API");
        
        let id = generateUniqueId();

        const date = new Date;
        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
        const formattedDate = moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');

        const newTLSRecord = await db.roamingQC.create({
            data: {
                id,
                machineId,
                unit,
                lineId,
                operatorRfid,
                obbOperationId,
                defects,
                inspectedQty,
                colorStatus,
                timestamp: formattedDate,
            }
        })

        return NextResponse.json({ data: newTLSRecord, message: 'Roaming QC recorded successfully' }, { status: 201 });

    } catch (error) {
        console.error("[ROAMING_QC_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}