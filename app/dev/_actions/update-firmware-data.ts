"use server";

import { db } from "@/lib/db";

export async function updateFirmwareData(data: { eliotSerialNo: string[], firmwareUrl: string }) {
    try {
        for (const eliotSerial of data.eliotSerialNo) {
            // await db.eliotFirmwareUpdate.create({
            //     data: {
            //         eliotSerialNo: eliotSerial,
            //         firmwareUrl: data.firmwareUrl
            //     }
            // });
            await db.eliotFirmwareUpdate.upsert({
                where: { eliotSerialNo: eliotSerial },
                update: { firmwareUrl: data.firmwareUrl },
                create: {
                    eliotSerialNo: eliotSerial,
                    firmwareUrl: data.firmwareUrl
                },
            })
        };

        return "done";
    } catch (error) {
        console.error("[UPDATE_FIRMWARE_DATA_ERROR]", error);
        return null;
    }
}