import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { seqNo,operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId, part,supervisorId } = await req.json();
        
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
        
        const susupervisorIdnew = await db.obbOperation.findMany({
            where: {
                part
            },
            select: {
                supervisorId: true,
                supervisor: {
                    select: {
                        id: true,
                        name:true
                    }
                },
                obbSheet: { // Include the obbSheet relationship
                    select: {
                        id: true, // Select the id from obbSheet
                         
                    }
                }
            }
        });
        const supervisorid = susupervisorIdnew.map(operation => 
            operation.supervisor ? operation.supervisor.id : 'No supervisor'
        );
        console.log("Supervisor Names:", supervisorid);





        const newObbOperation = await db.obbOperation.create({
            data: {
                id,
                seqNo,
                operationId, 
                obbSheetId,
                smv: parseFloat(smv), 
                target, 
                spi, 
                length, 
                totalStitches, 
                supervisorId:supervisorid[0],
                sewingMachineId,
                part
            }
        });
       console.log("data",newObbOperation)
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