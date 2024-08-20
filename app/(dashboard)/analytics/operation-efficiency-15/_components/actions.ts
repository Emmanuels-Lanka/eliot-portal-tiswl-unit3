"use server";
import { neon } from "@neondatabase/serverless";


export async function getData(obbsheetid:string,date:string)   {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`SELECT pd."productionCount" as count,o.name as name  ,oo."seqNo" as seq, pd.timestamp as timestamp
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    INNER JOIN "Operation" o ON o.id= oo."operationId"
    WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
     order by  pd.timestamp ;`;

    //console.log("data fetched",data,)


 
    return new Promise((resolve) => resolve(data ))
}