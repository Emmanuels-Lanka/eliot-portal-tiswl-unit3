import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { obbOperationId: string } }
) {
    try {
        const existingOperation = await db.obbOperation.findUnique({
            where: {
                id: params.obbOperationId
            },
            include: {
                sewingMachine: true
            }
        });
        
        if (!existingOperation) {
            return new NextResponse("OBB operation does not exist!", { status: 409 })
        }

        if (existingOperation.sewingMachine) {      // 1: A machine assigned to this Obb operation
            if (existingOperation.sewingMachine?.activeObbOperationId !== null) {       // 3: The machine is in active with a obb operation
                // Set the activeObbOperationId is null in Machine table
                await db.sewingMachine.update({
                    where: {
                        id: existingOperation.sewingMachine.id
                    },
                    data: {
                        activeObbOperationId: null
                    }
                });
                // Deactivate the OBB operation
                await db.obbOperation.update({
                    where: {
                        id: params.obbOperationId
                    },
                    data: { isActive: false }
                });
            } else {        // 4: The machine is not in active with any obb operations
                // Just deactivate the ObbOperation
                await db.obbOperation.update({
                    where: {
                        id: params.obbOperationId
                    },
                    data: { isActive: false }
                });
            }
        } else {        // 2: No machine assigned to this Obb operation
            // Just deactivate the ObbOperation
            await db.obbOperation.update({
                where: {
                    id: params.obbOperationId
                },
                data: { isActive: false }
            });
        }
        
        return new NextResponse("Deactivated the OBB Operation successfully", { status: 200 });
    } catch (error) {
        console.error("[OBB_OPERATION_STATUS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}