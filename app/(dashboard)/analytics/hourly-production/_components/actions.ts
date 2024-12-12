"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "../../daily-achivement/components/analytics-chart";


export async function getData(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql
    `
        SELECT 
            pd."id",
            pd."productionCount" as count,
            pd."timestamp",
            oo."id" as "obbOperationId",
            oo."seqNo",
            oo."target",
            oo."smv",
            concat(oo."seqNo",'-',o.name ) as "name",
            op."name" as "operatorName",
            op."employeeId" as "operatorEmployeeId",
            op."rfid" as "operatorRfid"
        FROM "ProductionData" pd
        INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
        INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
        INNER JOIN "Operation" o ON o.id = oo."operationId"
        LEFT JOIN "Operator" op ON pd."operatorRfid" = op.id
        WHERE os.id = ${obbsheetid} AND pd.timestamp LIKE  ${date}

        ORDER BY oo."seqNo" ASC;
    `;

    //console.log("data fetched",data,111)


 
    return new Promise((resolve) => resolve(data as ProductionDataType[] ))
}