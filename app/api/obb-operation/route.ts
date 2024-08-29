import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId, supervisorId, part } = await req.json();
        
        let id = generateUniqueId();

        // const existingMachine = await db.sewingMachine.findUnique({
        //     where: {
        //         id: sewingMachineId,
        //         activeObbOperationId: { not: null }
        //     }
        // });

        // if (existingMachine) {
        //     return new NextResponse("This sewing machine is already assigned to another operation.", { status: 409 })
        // };

        const seqCount = await db.obbOperation.count({
            where: {
                obbSheetId
            }
        });

        const newObbOperation = await db.obbOperation.create({
            data: {
                id,
                seqNo: seqCount + 1,
                operationId, 
                obbSheetId,
                smv: parseFloat(smv), 
                target, 
                spi, 
                length, 
                totalStitches, 
                supervisorId,
                sewingMachineId,
                part
            }
        });

        // Update the active operation on Machine table
        // await db.sewingMachine.update({
        //     where: {
        //         id: sewingMachineId
        //     },
        //     data: {
        //         activeObbOperationId: newObbOperation.id
        //     }
        // });

        return NextResponse.json({ data: newObbOperation, message: 'OBB Operation created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[OBB_OPERATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}