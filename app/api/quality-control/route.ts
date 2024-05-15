import { NextResponse } from "next/server";
import moment from 'moment';
import { SewingMachine } from "@prisma/client";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { machineId, operatorRfid, obbOperationId, colour, qcEmail, roundNo } = await req.json();

        let id = generateUniqueId();

        const date = new Date;
        const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss')

        const newTLSRecord = await db.trafficLightSystem.create({
            data: {
                id,
                machineId,
                operatorRfid,
                obbOperationId,
                qcEmail,
                roundNo,
                colour,
                timestamp: formattedDate,
            }
        })

        return NextResponse.json({ data: newTLSRecord, message: 'TLS recorded successfully' }, { status: 201 });

    } catch (error) {
        console.error("[TLS_RECORD_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}