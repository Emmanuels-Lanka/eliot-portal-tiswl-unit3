import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { unitId, machineType, brandName, serialNumber, machineId, eliotDeviceId, ownership } = await req.json();

        const existingMachineByID = await db.sewingMachine.findUnique({
            where: {
                serialNumber
            }
        });

        const existingMachineBySerialNo = await db.sewingMachine.findUnique({
            where: {
                machineId
            }
        });

        if (existingMachineByID || existingMachineBySerialNo) {
            return new NextResponse("Sewing machine is already registered", { status: 409 })
        }

        // Create a new machine
        const newMachine = await db.sewingMachine.create({
            data: {
                brandName,
                machineType,
                machineId,
                serialNumber,
                ownership,
                eliotDeviceId,
                unitId
            }
        });

        // Change the device state of isAssigned
        const deviceStatus = await db.eliotDevice.update({
            where: {
                id: eliotDeviceId
            },
            data: {
                isAssigned: true
            }
        })

        return NextResponse.json({ data: newMachine, message: 'Sewing machine is created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[SEWING_MACHINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}