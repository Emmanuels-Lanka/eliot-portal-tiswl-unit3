"use server";

import moment from 'moment-timezone';
import { neon } from "@neondatabase/serverless";

const sqlEliot = neon(process.env.DATABASE_URL || "");
const sqlRfid = neon(process.env.RFID_DATABASE_URL || "");
const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
const dateKey = `${today}%`;

export async function fetchFactoryStartTime(obbSheetId: string): Promise<any[]> {
    try {
        const data = await sqlEliot `
            select 
                os.id, 
                "factoryStartTime" start 
            from 
                "ProductionData" pd 
                inner join "ObbOperation" oo on oo.id = pd."obbOperationId" 
                inner join "ObbSheet" os on os.id = oo."obbSheetId" 
            where 
                pd.timestamp like ${dateKey} 
                and oo."obbSheetId" = ${obbSheetId} 
            group by 
                os.id, 
                start;`;

        return new Promise((resolve) => resolve(data));
    } catch (error) {
        console.error("FETCH_FACTORY_START_TIME_DATA", error);
        return [];
    }
}

export async function fetchProductionData(obbSheetId: string): Promise<any[]> {
    try {
        const data = await sqlRfid `
            select 
                count(pd."productId"), 
                ler."totalSMV", 
                "obbManPowers", 
                ler."obbSheetId" obbSheetId 
            from 
                "ProductDefect" pd 
                inner join "LineEfficiencyResources" ler on ler."obbSheetId" = pd."obbSheetId" 
            where 
                timestamp like ${dateKey} 
                and pd."qcStatus" = 'pass' 
                and pd."obbSheetId" = ${obbSheetId} 
                and pd."part" = 'line-end' 
            group by 
                ler."totalSMV", 
                "obbManPowers", 
                ler."obbSheetId";`;

        return new Promise((resolve) => resolve(data));
    } catch (error) {
        console.error("FETCH_PRODUCTION_DATA", error);
        return [];
    }
}

export async function fetchProductionCount(obbSheetId: string): Promise<number> {
    try {
        const data = await sqlRfid `
            SELECT 
                COUNT(*) AS count
            FROM 
                "ProductDefect"
            WHERE 
                "obbSheetId" = ${obbSheetId}
                AND "part" = 'line-end'
                AND "qcStatus" = 'pass'
                AND "timestamp" like ${dateKey};`;

        // console.log(data);

        return new Promise((resolve) => resolve(data[0].count));
    } catch (error) {
        console.error("FETCH_PRODUCTION_DATA", error);
        return 0;
    }
}