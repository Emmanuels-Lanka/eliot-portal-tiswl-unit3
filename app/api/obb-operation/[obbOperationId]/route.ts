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

        // Set null the active operation in Machine table
        if (existingOperationById.sewingMachineId) {
            await db.sewingMachine.update({
                where: {
                    id: existingOperationById.sewingMachineId
                },
                data: {
                    activeObbOperationId: null,
                }
            });
        };

        // Delete the OBB operation from the database
        await db.obbOperation.delete({
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

// export async function PUT(
//     req: Request,
//     { params }: { params: { obbOperationId: string } }
// ) {
//     try {
//         const { seqNo,operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId, supervisorId, part } = await req.json();

//         const existingObbOperation = await db.obbOperation.findUnique({
//             where: {
//                 id: params.obbOperationId
//             }
//         });

//         if (!existingObbOperation) {
//             return new NextResponse("OBB operation does not exist!", { status: 408 })
//         }

//         if (existingObbOperation?.sewingMachineId !== sewingMachineId) {
//             // Checking the machine is available
//             const availableMachine = await db.sewingMachine.findUnique({
//                 where: {
//                     id: sewingMachineId,
//                     activeObbOperationId: null
//                 }
//             });
    
//             if (!availableMachine) {
//                 return new NextResponse("This sewing machine is already assigned to another operation.", { status: 409 })
//             }

//             if (existingObbOperation.sewingMachineId) {
//                 // Set null the active operation in Machine table
//                 await db.sewingMachine.update({
//                     where: {
//                         id: existingObbOperation.sewingMachineId
//                     },
//                     data: {
//                         activeObbOperationId: null,
//                     }
//                 });
//             }

//             // Update the current active OBB Operation
//             await db.sewingMachine.update({
//                 where: {
//                     id: sewingMachineId 
//                 },
//                 data: {
//                     activeObbOperationId: params.obbOperationId
//                 }
//             });
            
//         }





        
//         const updatedOperation = await db.obbOperation.update({
//             where: {
//                 id: params.obbOperationId
//             },
//             data: {
//                 seqNo,
//                 operationId, 
//                 obbSheetId,
//                 smv: parseFloat(smv), 
//                 target, 
//                 spi, 
//                 length, 
//                 totalStitches, 
//                 supervisorId,
//                 sewingMachineId,
//                 part
//             }
//         });

//         return NextResponse.json({ data: updatedOperation, message: 'OBB sheet updated successfully' }, { status: 201 });
//     } catch (error) {
//         console.error("[OBB_OPERATION_UPDATE_ERROR]", error);
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }


export async function PUT(
    req: Request,
    { params }: { params: { obbOperationId: string } }
) {
    try {
        const { seqNo, operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId, supervisorId, part } = await req.json();

        const existingObbOperation = await db.obbOperation.findUnique({
            where: {
                id: params.obbOperationId
            }
        });

        if (!existingObbOperation) {
            return new NextResponse("OBB operation does not exist!", { status: 408 })
        }

        // If sewingMachineId is not provided, skip the machine assignment logic
        if (sewingMachineId) {
            if (existingObbOperation?.sewingMachineId !== sewingMachineId) {
                // Checking the machine is available
                const availableMachine = await db.sewingMachine.findUnique({
                    where: {
                        id: sewingMachineId,
                        activeObbOperationId: null
                    }
                });

                if (!availableMachine) {
                    return new NextResponse("This sewing machine is already assigned to another operation.", { status: 409 })
                }

                if (existingObbOperation.sewingMachineId) {
                    // Set null the active operation in Machine table
                    await db.sewingMachine.update({
                        where: {
                            id: existingObbOperation.sewingMachineId
                        },
                        data: {
                            activeObbOperationId: null,
                        }
                    });
                }

                // Update the current active OBB Operation
                await db.sewingMachine.update({
                    where: {
                        id: sewingMachineId 
                    },
                    data: {
                        activeObbOperationId: params.obbOperationId
                    }
                });
            }
        }

        const updatedOperation = await db.obbOperation.update({
            where: {
                id: params.obbOperationId
            },
            data: {
                seqNo,
                operationId, 
                obbSheetId,
                smv: parseFloat(smv), 
                target, 
                spi, 
                length, 
                totalStitches, 
                supervisorId,
                sewingMachineId:sewingMachineId||null, // Only update if provided
                part
            }
        });

        return NextResponse.json({ data: updatedOperation, message: 'OBB sheet updated successfully' }, { status: 201 });
    } catch (error) {
        console.error("[OBB_OPERATION_UPDATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}