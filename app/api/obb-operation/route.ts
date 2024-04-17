import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId } = await req.json();
        
        let id = generateUniqueId();

        const existingOperationByID = await db.obbOperation.findUnique({
            where: {
                id
            }
        });

        if (existingOperationByID) {
            return new NextResponse("Obb Operation is already exist!", { status: 409 })
        }

        const newObbOperation = await db.obbOperation.create({
            data: {
                id,
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