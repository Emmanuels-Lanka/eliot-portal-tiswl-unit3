"use server"

import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

export async function fetchGmtDefectsForDHU(obbSheetId: string): Promise<DHUDefectsDataTypes> {
    try {
        const sql = neon(process.env.RFID_DATABASE_URL || "");

        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
        const today = moment().tz(timezone).format('YYYY-MM-DD');
        const threeDaysBefore = moment().tz(timezone).add(-3, 'days').format('YYYY-MM-DD');
        const startDate = `${threeDaysBefore} 00:00:00`;
        const endDate = `${today} 23:59:59`;

        const gmtDefects = await sql`
            SELECT 
                gd.id, 
                gd."qcStatus", 
                gd.timestamp, 
                gd."obbOperationId", 
                gd."operatorId", 
                gd."operatorName",
                ARRAY_AGG(COALESCE(d.id, '{}')) AS defects
            FROM 
                "GmtDefect" gd
            LEFT JOIN
                "_GmtQC" gdd ON gdd."B" = gd.id
            LEFT JOIN
                "Defect" d ON d.id = gdd."A"
            WHERE 
                gd.timestamp >= ${startDate} AND
                gd.timestamp <= ${endDate} AND
                gd."qcStatus" <> 'pass' AND
                gd."obbSheetId" = ${obbSheetId}
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