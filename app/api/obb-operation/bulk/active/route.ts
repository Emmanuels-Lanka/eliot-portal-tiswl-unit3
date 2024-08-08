import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
    req: Request
) {
    const body = await req.json();
    const obbOperationIds: string[] = body.obbOperationIds;

    try {
        const results = [];

        for (const obbOperationId of obbOperationIds) {
            const existingOperation = await db.obbOperation.findUnique({
                where: {
                    id: obbOperationId
                },
                include: {
                    sewingMachine: true
                }
            });

            if (!existingOperation) {
                results.push({ id: obbOperationId, status: "OBB operation does not exist!", statusCode: 409 });
                continue;
            }

            if (existingOperation.sewingMachine) {
                if (existingOperation.sewingMachine?.activeObbOperationId !== null) {
                    if (existingOperation.sewingMachine?.activeObbOperationId !== obbOperationId) {
                        results.push({ id: obbOperationId, status: "Machine already in active, Cannot activate the same machine for this operation!", statusCode: 409 });
                        continue;
                    }
                } else {
                    await db.sewingMachine.update({
                        where: {
                            id: existingOperation.sewingMachine.id
                        },
                        data: {
                            activeObbOperationId: obbOperationId
                        }
                    });
                }
            }

            await db.obbOperation.update({
                where: {
                    id: obbOperationId
                },
                data: { isActive: true }
            });
            results.push({ id: obbOperationId, status: "Activated the OBB Operation successfully", statusCode: 200 });
        };
        
        return NextResponse.json(results, { status: 201 });
    } catch (error) {
        console.error("[BULK_OBB_OPERATION_STATUS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}