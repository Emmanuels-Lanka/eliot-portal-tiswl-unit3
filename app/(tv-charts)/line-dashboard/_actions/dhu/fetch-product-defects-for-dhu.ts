"use server"

import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

export async function fetchProductDefectsForDHU(obbSheetId: string): Promise<DHUDefectsDataTypes> {
    try {
        const sql = neon(process.env.RFID_DATABASE_URL || "");

        const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
        const dateKey = `${today}%`;

        const productDefects = await sql`
            SELECT 
                pd.id,
                pd.timestamp,
                pd."productId" AS "itemId",
                pd."qcStatus",
                pd.part,
                pd."obbOperationId",
                pd."operatorId",
                pd."operatorName",
                ARRAY_AGG(d.name) AS defects
            FROM 
                "ProductDefect" pd
            LEFT JOIN 
                "_ProductQC" pdq ON pdq."B" = pd.id
            LEFT JOIN 
                "Defect" d ON d.id = pdq."A"
            WHERE 
                pd.timestamp like ${dateKey}
                AND pd."obbSheetId" = ${obbSheetId}
                AND pd.part IN ('assembly', 'line-end')
            GROUP BY 
                pd.id
            ORDER BY 
                pd."createdAt" ASC;`;

        return new Promise((resolve) => resolve(productDefects as DHUDefectsDataTypes));
    } catch (error) {
        console.error("[FETCH_PRODUCT_DEFECTS_ERROR]", error);
        return [];
    }
}