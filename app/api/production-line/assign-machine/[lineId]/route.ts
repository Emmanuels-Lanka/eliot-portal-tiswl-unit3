import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { lineId: string } }
) {
    try {
        const { machineId } = await req.json();

        // Update isAssigned field in SewingMachine
        await db.sewingMachine.update({
            where: {
                id: machineId
            },
            data: {
                isAssigned: true,
            }
        });

        // Add machineId to machines array in ProductionLine
        const updatedLine = await db.productionLine.update({
            where: {
                id: params.lineId
            },
            data: {
                machines: {
                    connect: {
                        id: machineId
                    }
                }
            }
        });

        return NextResponse.json({ data: updatedLine, message: 'Machine assigned successfully!' }, { status: 201 });

    } catch (error) {
        console.error("[ASSIGN_MACHINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
