"use server"

import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

export async function fetchProductDefectsForDHU(obbSheetId: string): Promise<DHUDefectsDataTypes> {
    try {
        const sql = neon(process.env.RFID_DATABASE_URL || "");

        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
        const today = moment().tz(timezone).format('YYYY-MM-DD');
        const threeDaysBefore = moment().tz(timezone).add(-3, 'days').format('YYYY-MM-DD');
        const startDate = `${threeDaysBefore} 00:00:00`;
        const endDate = `${today} 23:59:59`;

        const productDefects = await sql`
            SELECT 
                pd.id, 
                pd."qcStatus", 
                pd."productId" AS "itemId",
                pd.timestamp, 
                pd."obbOperationId", 
                pd."operatorId", 
                pd."operatorName",
                ARRAY_AGG(COALESCE(d.id, '{}')) AS defects
            FROM 
                "ProductDefect" pd
            LEFT JOIN
                "_ProductQC" pdd ON pdd."B" = pd.id
            LEFT JOIN
                "Defect" d ON d.id = pdd."A"
            WHERE 
                pd."isThisEndQc" = TRUE 
                AND pd.timestamp >= ${startDate} 
                AND pd.timestamp <= ${endDate} 
                AND pd."qcStatus" <> 'pass' 
                AND pd."obbSheetId" = ${obbSheetId}
            GROUP BY
                pd.id
            ORDER BY 
                pd."createdAt" ASC;`;

        return new Promise((resolve) => resolve(productDefects as DHUDefectsDataTypes));
    } catch (error) {
        console.error("[FETCH_GMT_DEFECTS_ERROR]", error);
        return [];
    }
}