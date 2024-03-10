import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { deviceId: string } }
) {
    try {
        const existingDeviceById = await db.eliotDevice.findUnique({
            where: {
                id: params.deviceId
            }
        });

        if (!existingDeviceById) {
            return new NextResponse("This device does not exist", { status: 409 })
        }

        const deletedDevice = await db.eliotDevice.delete({
            where: {
                id: params.deviceId
            }
        });

        return new NextResponse("Device is deleted successfully", { status: 201 })
    } catch (error) {
        console.error("[DELETE_ELIOT_DEVICE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { deviceId: string } }
) {
    try {
        const { serialNumber, modelNumber, installedDate } = await req.json();

        const existingDeviceById = await db.eliotDevice.findUnique({
            where: {
                id: params.deviceId
            }
        });

        if (!existingDeviceById) {
            return new NextResponse("This device does not exist", { status: 409 })
        }

        const updatedDevice = await db.eliotDevice.update({
            where: {
                id: params.deviceId
            },
            data: {
                serialNumber,
                modelNumber,
                installedDate
            }
        });

        return NextResponse.json({ data: updatedDevice, message: 'ELIoT device updated successfully'}, { status: 201 });
        
    } catch (error) {
        console.error("[UPDATE_ELIOT_DEVICE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}