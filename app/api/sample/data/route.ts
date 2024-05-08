import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        // Testing merge
        const { operatorRfid, eliotSerialNumber, obbOperationId } = await req.json();

        let id = generateUniqueId();
        const timestamp = "2024-04-21 11:38:44"

        const createdSession = await db.productionData.create({
            data: {
                id,
                operatorRfid,
                eliotSerialNumber,
                obbOperationId,
                productionCount: 10,
                timestamp
            }
        });
        return NextResponse.json({ data: createdSession, message: 'Session created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[PRODUCTION_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}