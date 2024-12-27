"use server";

import { neon } from '@neondatabase/serverless';

export async function fetchBundleStyles(): Promise<string[]> {
    try {
        const sql = neon(process.env.RFID_DATABASE_URL || "");

        const data = await sql`
            SELECT DISTINCT "styleNo"
            FROM "GmtData"
            WHERE "createdAt" >= (NOW() - INTERVAL '3 months')::DATE;`;

        const styles = data.map(style => style.styleNo);

        // console.log("ObbSheets:", data);
        return new Promise((resolve) => resolve(styles as string[]));
    } catch (error) {
        console.error("[FETCH_BUNDLE_STYLES_ERROR]", error);
        return [];
    }
}