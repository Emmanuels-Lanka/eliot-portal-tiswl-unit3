"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./components/analytics-chart";

export async function getData(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`SELECT SUM(pd."productionCount") as count,o.name as name   ,oo.target as target
            FROM "ProductionData" pd
            INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
            INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
            INNER JOIN "Operation" o ON o.id= oo."operationId"
            WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
            group by o.name,oo."seqNo",oo.target order by  oo."seqNo" ;`;
    //console.log("data",data,)


 
    return new Promise((resolve) => resolve(data as ProductionDataType[] ))
}