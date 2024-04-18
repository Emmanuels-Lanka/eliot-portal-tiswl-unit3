import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { operatorRfid, eliotSerialNo, obbOperationId } = await req.json();

        let id = generateUniqueId();
        const timestamp = new Date()

        const createdSession = await db.productionData.create({
            data: {
                id,
                operatorRfid,
                eliotSerialNo,
                obbOperationId,
                productionCount: 10,
                timestamp: timestamp.toISOString() as string
            }
        });
        return NextResponse.json({ data: createdSession, message: 'Session created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[PRODUCTION_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}