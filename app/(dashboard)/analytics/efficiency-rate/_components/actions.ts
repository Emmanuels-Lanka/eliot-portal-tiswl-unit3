"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./analytics-chart";

export async function getOperatorEfficiency(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    // const data1 = await sql`SELECT sum(pd."productionCount") as count,o.name  ,oo.target
    //         FROM "ProductionData" pd
    //         INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    //         INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    //         INNER JOIN "Operation" o ON o.id= pd."obbOperationId"
    //         WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
    //         group by o.name,oo."seqNo",oo.target order by  oo."seqNo" ;`;
    
     const data = await sql`SELECT concat(obbopn."seqNo",'-',opn.name ) as name,sum(pd."productionCount")  as count, obbopn.target,obbopn."seqNo"
            FROM "ProductionData" pd
            INNER JOIN "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
            INNER JOIN "Operation" opn ON opn.id= obbopn."operationId"
            INNER JOIN "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
            WHERE pd.timestamp like  '2024-09-05%' and  obbs.id = ${obbsheetid}
            group by opn.name,obbopn."seqNo",obbopn.target order by  obbopn."seqNo"`
    
            console.log(data)
    
    
    return new Promise((resolve) => resolve(data as ProductionDataType[] ))
}