import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const {
            unitId,
            obbSheetId,
            date,
            sewingOperators,
            ironOperators,
            helpers,
            manPowers,
            frontQcTarget,
            backQcTarget,
            endQcTarget,
            workingHours,
            totalSMV,
            targetEfficiency
        } = await req.json();

        let id = generateUniqueId();

        const existingRecord = await db.lineEfficiencyResources.count({
            where: {
                date
            }
        });

        if (existingRecord > 0) {
            return new NextResponse("Line efficiency was recorded for today", { status: 409 })
        }

        await db.lineEfficiencyResources.create({
            data: {
                id,
                unitId,
                obbSheetId,
                date,
                sewingOperators,
                ironOperators,
                helpers,
                manPowers,
                frontQcTarget,
                backQcTarget,
                endQcTarget,
                workingHours,
                totalSMV,
                targetEfficiency
            }
        });

        return new NextResponse("Created new line efficiency record", { status: 201 });

    } catch (error) {
        console.error("[ELIOT_DEVICE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}