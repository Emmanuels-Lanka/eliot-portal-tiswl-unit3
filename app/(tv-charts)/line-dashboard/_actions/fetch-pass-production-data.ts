"use server"

import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

type ProductionDataType = {
    id: string;
    obbSheetId: string | null;
    createdAt: Date;
    timestamp: string;
    productId: string;
    qcStatus: string;
    qcPointId: string;
    obbOperationId: string | null;
    operatorId: string | null;
    operatorName: string | null;
    part: string;
}[];

export async function fetchPassProductionData(obbSheetId: string): Promise<ProductionDataType> {
    try {
        const sql = neon(process.env.RFID_DATABASE_URL || "");

        const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
        // console.log("TODAY: " + today);
        const dateKey = `${today}%`;

        const productDefects = await sql`
            SELECT *
            FROM 
                "ProductDefect"
            WHERE 
                timestamp like ${dateKey}
                AND "obbSheetId" = ${obbSheetId}
                AND "qcStatus" = 'pass'
                AND part = 'line-end'
            ORDER BY 
                "createdAt" ASC;`;

        // console.log("PC:", productDefects.length);

        return new Promise((resolve) => resolve(productDefects as ProductionDataType));
    } catch (error) {
        console.error("[FETCH_PASSED_PRODUCTION_DATA_ERROR]", error);
        return [];
    }
}