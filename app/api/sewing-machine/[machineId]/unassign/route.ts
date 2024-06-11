import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: { machineId: string } }
) {
    const url = new URL(req.url);
    const deviceId = url.searchParams.get('deviceId');

    try {
        if (!deviceId) {
            return new NextResponse("Device ID is undefined", { status: 409 })
        }

        await db.sewingMachine.update({
            where: {
                id: params.machineId
            },
            data: {
                eliotDeviceId: null
            }
        });

        await db.eliotDevice.update({
            where: {
                id: deviceId
            },
            data: {
                isAssigned: false
            }
        });

        return new NextResponse("Unassigned successfully!", { status: 201 })
    } catch (error) {
        console.error("[UNASSIGN_DEVICE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}