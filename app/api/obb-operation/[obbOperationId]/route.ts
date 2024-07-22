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
        const { operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId, supervisorId } = await req.json();

        const existingObbOperation = await db.obbOperation.findUnique({
            where: {
                id: params.obbOperationId
            },
            select: {
                sewingMachine: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!existingObbOperation) {
            return new NextResponse("OBB operation does not exist!", { status: 408 })
        }

        if (existingObbOperation?.sewingMachine?.id !== sewingMachineId) {
            const existingMachine = await db.sewingMachine.findUnique({
                where: {
                    id: sewingMachineId
                },
                include: {
                    obbOperation: true
                }
            });
    
            if (existingMachine && existingMachine.obbOperation) {
                return new NextResponse("This sewing machine is already assigned to another operation.", { status: 409 })
            }
        }

        const updatedOperation = await db.obbOperation.update({
            where: {
                id: params.obbOperationId
            },
            data: {
                operationId, 
                obbSheetId,
                smv, 
                target, 
                spi, 
                length, 
                totalStitches, 
                supervisorId,
                sewingMachine: {
                    connect: {
                        id: sewingMachineId
                    }
                }
            }
        });

        return NextResponse.json({ data: updatedOperation, message: 'OBB sheet updated successfully' }, { status: 201 });
    } catch (error) {
        console.error("[OBB_OPERATION_UPDATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}