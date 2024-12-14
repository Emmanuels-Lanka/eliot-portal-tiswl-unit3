"use server";

import moment from 'moment-timezone';
import { neon } from "@neondatabase/serverless";

export async function calculateRejection(obbSheetId: string): Promise<number> {
    const sql = neon(process.env.RFID_DATABASE_URL || "");
    const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
    const dateKey = `${today}%`;

    try {
        const data = await sql `
            SELECT *
            FROM 
                "ProductDefect" pd
            WHERE 
                pd."obbSheetId" = ${obbSheetId}
                AND pd."qcStatus" = 'reject'
                AND pd.part = 'line-end'
                AND pd.timestamp like ${dateKey};`;
        
        return new Promise((resolve) => resolve(data.length));
    } catch (error) {
        console.error("CALCULATE_REJECTION_COUNT", error);
        return 0;
    }
}