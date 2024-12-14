"use server"

import { neon } from '@neondatabase/serverless';

type ReturnDataType = {
    totalSMV: number;
    productionTarget: number;
    workingHours: number;
    targetWorkingHours: number;
    targetEfficiency: number;
    obbManPowers: number;
    utilizedManPowers: number;
}

export async function fetchLineEfficiencyResource(obbSheetId: string): Promise<ReturnDataType | null> {
    try {
        const sql = neon(process.env.RFID_DATABASE_URL || "");

        const data = await sql `
            SELECT 
                "totalSMV", 
                "endQcTarget" as "productionTarget", 
                "workingHours", 
                "targetWorkingHours", 
                "targetEfficiency", 
                "obbManPowers",
                "utilizedManPowers"
            FROM 
                "LineEfficiencyResources"
            WHERE 
                "obbSheetId" = ${obbSheetId};`;

        // console.log("LINE:", data);
        return new Promise((resolve) => resolve(data[0] as ReturnDataType));
    } catch (error) {
        console.error("[FETCH_LINE_EFFICIENCY_RESOURCES_ERROR]", error);
        return null;
    }
}