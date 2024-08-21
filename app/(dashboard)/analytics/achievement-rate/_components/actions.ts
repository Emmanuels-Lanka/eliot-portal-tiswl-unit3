"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./analytics-chart";

export async function getOperatorEfficiency(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`SELECT sum(pd."productionCount") as count, name:item.name.trim().substring(0,10)+"...", ,oo.target
            FROM "ProductionData" pd
            INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
            INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
            INNER JOIN "Operator" o ON o.rfid= pd."operatorRfid"
            WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
            group by o.name,oo."seqNo",oo.target order by  oo."seqNo" ;`;
    console.log("data",data,)
    return new Promise((resolve) => resolve(data as ProductionDataType[] ))
}