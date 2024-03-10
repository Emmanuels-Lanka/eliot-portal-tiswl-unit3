import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { serialNumber, modelNumber, installedDate } = await req.json();

        const existingDeviceBySerialNo = await db.eliotDevice.findUnique({
            where: {
                serialNumber
            }
        });

        if (existingDeviceBySerialNo) {
            return new NextResponse("This device is already registered", { status: 409 })
        }

        const newDevice = await db.eliotDevice.create({
            data: {
                serialNumber,
                modelNumber,
                installedDate
            }
        });

        return NextResponse.json({ data: newDevice, message: 'ELIoT device created successfully'}, { status: 201 });
        
    } catch (error) {
        console.error("[ELIOT_DEVICE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}