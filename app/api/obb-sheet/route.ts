import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { 
            unitId, productionLineId, indEngineer, supervisor1, supervisor2, mechanic, qualityIns, accInputMan, fabInputMan, 
            buyer, style, item, operators, helpers, startingDate, endingDate, workingHours, 
            efficiencyLevel1, efficiencyLevel2, efficiencyLevel3, itemReference, totalMP, totalSMV, bottleNeckTarget, target100, 
            ucl, lcl, balancingLoss, balancingRatio, colour, supResponseTime, mecResponseTime, qiResponseTime, 
        } = await req.json();

        let id = generateUniqueId();

        const existingSheetByID = await db.obbSheet.findUnique({
            where: {
                id
            }
        });

        if (existingSheetByID) {
            return new NextResponse("Obb sheet is already exist!", { status: 409 })
        }

        // Fetch the line name
        const line = await db.productionLine.findUnique({
            where: {
                id: productionLineId
            }
        });

        const name = `${line?.name}-${style}`

        const newSheet = await db.obbSheet.create({
            data: {
                id, name, unitId, productionLineId, 
                indEngineerId: indEngineer, 
                supervisor1Id: supervisor1, 
                supervisor2Id: supervisor2,
                mechanicId: mechanic, 
                qualityInsId: qualityIns, 
                accInputManId: accInputMan, 
                fabInputManId: fabInputMan, 
                buyer, style, item, operators, helpers, startingDate, endingDate, workingHours, efficiencyLevel1,
                efficiencyLevel2, efficiencyLevel3, itemReference, totalMP, totalSMV, bottleNeckTarget,
                target100, ucl, lcl, balancingLoss, balancingRatio, colour, supResponseTime, mecResponseTime, qiResponseTime,
            }
        });

        return NextResponse.json({ data: newSheet, message: 'OBB sheet created successfully' }, { status: 201 });
    } catch (error) {
        console.error("[OBB_SHEET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}