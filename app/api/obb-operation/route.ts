import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId } = await req.json();

        const newObbOperation = await db.obbOperation.create({
            data: {
                operationId, 
                sewingMachineId, 
                smv, 
                target, 
                spi, 
                length, 
                totalStitches, 
                obbSheetId
            }
        });

        return NextResponse.json({ data: newObbOperation, message: 'OBB Operation created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[OBB_OPERATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}