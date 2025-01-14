"use server";

import { poolForRFID } from '@/lib/postgres';
import { neon } from '@neondatabase/serverless';

export async function fetchBundleStyles(): Promise<string[]> {


    try {
  
        const query = `
       SELECT DISTINCT "styleNo"
            FROM "GmtData"
            WHERE "createdAt" >= (NOW() - INTERVAL '3 months')::DATE;
        `;
        // const values = [obbsheetid,date];
    
        const result = await poolForRFID.query(query);
        const styles = result.rows.map(style => style.styleNo);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(styles as string[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }

    // try {
    //    

    //     const data = await sql`
    //         `;

    //     const styles = data.map(style => style.styleNo);

    //     // console.log("ObbSheets:", data);
    //     return new Promise((resolve) => resolve(styles as string[]));
    // } catch (error) {
    //     console.error("[FETCH_BUNDLE_STYLES_ERROR]", error);
    //     return [];
    // }
}