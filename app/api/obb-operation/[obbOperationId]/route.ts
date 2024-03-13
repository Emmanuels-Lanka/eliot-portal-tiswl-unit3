import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { obbOperationId: string } }
) {
    try {
        const existingOperationById = await db.obbOperation.findUnique({
            where: {
                id: params.obbOperationId
            }
        });

        if (!existingOperationById) {
            return new NextResponse("OBB operation does not exist!", { status: 409 })
        }

        const deletedOperation = await db.obbOperation.delete({
            where: {
                id: params.obbOperationId
            }
        });

        return new NextResponse("OBB operation removed successfully", { status: 201 })
    } catch (error) {
        console.error("[OBB_OPERATION_DELETE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { obbOperationId: string } }
) {
    try {
        const { operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId } = await req.json();

        const existingOperationById = await db.obbOperation.findUnique({
            where: {
                id: params.obbOperationId
            }
        });

        if (!existingOperationById) {
            return new NextResponse("The OBB operation does not exist", { status: 409 })
        };

        const updatedOperation = await db.obbOperation.update({
            where: {
                id: params.obbOperationId
            },
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

        return NextResponse.json({ data: updatedOperation, message: 'OBB sheet updated successfully' }, { status: 201 });
    } catch (error) {
        console.error("[OBB_OPERATION_UPDATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}