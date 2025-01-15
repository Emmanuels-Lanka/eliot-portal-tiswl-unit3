"use server"

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function handleDuplicateObb(obbSheet: any) {
    const { 
        version, unitId, productionLineId, indEngineerId, supervisorFrontId, supervisorBackId, supervisorAssemblyId, supervisorLineEndId, mechanicId, qualityInsId, accInputManId, fabInputManId, lineChiefId, 
        buyer, style, item, operators, helpers, startingDate, endingDate, workingHours, factoryStartTime, factoryStopTime, bundleTime, personalAllowance,
        efficiencyLevel1, efficiencyLevel2, efficiencyLevel3, itemReference, totalMP, totalSMV, availableMinPerHour, obbOperationsNo, bottleNeckTarget, target100, 
        ucl, lcl, balancingLoss, balancingRatio, colour, supResponseTime, mecResponseTime, qiResponseTime, 
    } = obbSheet;

    try {
        const data = await db.obbSheet.create({
            data: {
                id: generateUniqueId(),
                name: `${obbSheet.productionLine.name}-${style}-v${version} Copy`,
                isActive: false, productionLineId, unitId,
                indEngineerId, supervisorFrontId, supervisorBackId, supervisorAssemblyId, supervisorLineEndId, mechanicId, qualityInsId, accInputManId, fabInputManId, lineChiefId,
                buyer, style, item, operators, helpers, startingDate, endingDate, factoryStartTime, factoryStopTime, workingHours: parseFloat(workingHours), bundleTime, personalAllowance,
                efficiencyLevel1, efficiencyLevel2, efficiencyLevel3, itemReference, totalMP, totalSMV: parseFloat(totalSMV), availableMinPerHour, obbOperationsNo, bottleNeckTarget,
                target100, ucl, lcl, balancingLoss, balancingRatio, colour, supResponseTime, mecResponseTime, qiResponseTime
            }
        });

        return data;
    } catch (error) {
        console.error("[DUPLICATE_OBB_SHEET_ERROR]", error);
        return null;
    }
}