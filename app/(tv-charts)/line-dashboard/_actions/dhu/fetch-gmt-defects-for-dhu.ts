"use server"

import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

export async function fetchGmtDefectsForDHU(obbSheetId: string): Promise<DHUDefectsDataTypes> {
    try {
        const sql = neon(process.env.RFID_DATABASE_URL || "");

        const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
        const dateKey = `${today}%`;

        const gmtDefects = await sql`
            SELECT 
                gd.id,
                gd.timestamp,
                gd."gmtId" AS "itemId",
                gd."qcStatus",
                gd.part,
                gd."obbOperationId",
                gd."operatorId",
                gd."operatorName",
                ARRAY_AGG(d.name) AS defects
            FROM 
                "GmtDefect" gd
            LEFT JOIN 
                "_GmtQC" gdd ON gdd."B" = gd.id
            LEFT JOIN 
                "Defect" d ON d.id = gdd."A"
            WHERE 
                gd.timestamp like ${dateKey}
                AND gd."obbSheetId" = ${obbSheetId}
            GROUP BY 
                gd.id
            ORDER BY 
                gd."createdAt" ASC;`;

        return new Promise((resolve) => resolve(gmtDefects as DHUDefectsDataTypes));
    } catch (error) {
        console.error("[FETCH_GMT_DEFECTS_ERROR]", error);
        return [];
    }
}