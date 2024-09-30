import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { seqNo,operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId, part,supervisorId } = await req.json();
        
        let id = generateUniqueId();




       const existingOperation = await db.obbOperation.findFirst({
        where: {
        sewingMachineId: sewingMachineId,
        obbSheetId: obbSheetId,
            },
            select:{
                obbSheet: { 
                    select: {
                        id: true,
                        isActive:true, 
                         
                    }
                }
            }
        }); 

        if (existingOperation) {
            return new NextResponse("This sewing machine is already assigned to another operation.", { status: 409 });
        }




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
                // supervisorId: true,
                seqNo:true,
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
        // console.log("Supervisor Names:", supervisorid);



       



       
        


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
    //    console.log("data123456",newObbOperation)
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




// export async function GET(req: Request) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const obbSheetId = searchParams.get("obbSheetId"); // Get the obbSheetId from the query parameters

//         if (!obbSheetId) {
//             return new NextResponse("obbSheetId is required", { status: 400 });
//         }

//         // Find the operation with the maximum seqNo for the given obbSheetId
//         const maxSeqOperation = await db.obbOperation.findFirst({
//             where: {
//                 obbSheetId: obbSheetId, // Filter by obbSheetId
//             },
//             select: {
//                 seqNo: true, // Only select the seqNo
//                 obbSheet: {
//                     select: {
//                         id: true,
//                     },
//                 },
//             },
//             orderBy: {
//                 seqNo: "desc", // Order by seqNo in descending order to get the max
//             },
//         });

//         if (!maxSeqOperation) {
//             return new NextResponse("No operations found for the given obbSheetId", { status: 404 });
//         }

//         return NextResponse.json({ data: maxSeqOperation, message: 'Max sequence number fetched successfully' }, { status: 200 });

//     } catch (error) {
//         console.error("[OBB_OPERATION_ERROR]", error);
//         return new NextResponse("Internal Error", { status: 500 });
//     }
// }



export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const obbSheetId = searchParams.get("obbSheetId");

        if (!obbSheetId) {
            return new NextResponse("obbSheetId is required", { status: 400 });
        }

        // Find all operations for the given obbSheetId, ordered by seqNo in descending order
        const operations = await db.obbOperation.findMany({
            where: {
                obbSheetId: obbSheetId,
            },
            select: {
                seqNo: true, // Select seqNo
                obbSheet: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: {
                seqNo: "desc", // Order by seqNo in descending order
            },
        });

        if (!operations || operations.length === 0) {
            return new NextResponse("No operations found for the given obbSheetId", { status: 404 });
        }

        return NextResponse.json({ data: operations, message: 'Operations fetched successfully' }, { status: 200 });

    } catch (error) {
        console.error("[OBB_OPERATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


