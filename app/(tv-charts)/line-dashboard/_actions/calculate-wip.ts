"use server";

import { neon } from "@neondatabase/serverless";

export async function calculateWIP(obbSheetId: string): Promise<number> {
    const sql = neon(process.env.RFID_DATABASE_URL || "");

    try {
        const frontCount = await sql `
            SELECT 
                COUNT(*) AS count
            FROM 
                "GmtData"
            WHERE 
                "partName" = 'FRONT'
                AND "obbSheetId" = ${obbSheetId}
                AND "timestampProduction" IS NOT NULL;`

        const lineEndCount = await sql `
            SELECT 
                COUNT(*) AS count
            FROM 
                "ProductDefect"
            WHERE 
                "part" = 'line-end'
                AND "qcStatus" = 'pass'
                AND "obbSheetId" = ${obbSheetId};`

        const wip = frontCount[0].count - lineEndCount[0].count;

        return new Promise((resolve) => resolve(wip));
    } catch (error) {
        console.error("CALCULATE_REJECTION_COUNT", error);
        return 0;
    }
}