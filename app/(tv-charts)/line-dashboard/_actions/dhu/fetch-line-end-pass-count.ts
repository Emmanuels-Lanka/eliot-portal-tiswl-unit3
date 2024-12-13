"use server"

import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

export async function fetchLineEndPassCount(obbSheetId: string): Promise<number> {
    try {
        const sql = neon(process.env.RFID_DATABASE_URL || "");

        const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
        const dateKey = `${today}%`;

        const data = await sql`
            SELECT 
                COUNT(*) AS count
            FROM 
                "ProductDefect"
            WHERE 
                timestamp like ${dateKey}
                AND "obbSheetId" = ${obbSheetId}
                AND "qcStatus" = 'pass'
                AND part = 'line-end';`;

        return new Promise((resolve) => resolve(data[0].count as number));
    } catch (error) {
        console.error("[FETCH_PRODUCT_DEFECTS_ERROR]", error);
        return 0;
    }
}