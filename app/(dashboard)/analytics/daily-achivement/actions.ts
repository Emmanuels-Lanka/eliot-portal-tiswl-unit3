"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./components/analytics-chart";

export async function getData(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`select SUM(pd."productionCount") as count
,concat(oo."seqNo",'-',o.name ) as name ,oo.target,sm."machineId" as machine
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    INNER JOIN "Operation" o ON o.id= oo."operationId"
    INNER JOIN "SewingMachine" sm on sm.id = oo."sewingMachineId"
    WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
    group by o.name,oo.target,oo."seqNo",machine order by  oo."seqNo" ;`;

    //console.log("data fetched",data,111)
    console.log("data",obbsheetid,date)


 
    return new Promise((resolve) => resolve(data as ProductionDataType[] ))
}


export async function getExelData(obbsheetid:string,date:string)    {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`SELECT 
    SUM(pd."productionCount") AS count,
    CONCAT(oo."seqNo", '-', o.name) AS name,
    oo.target,
    EXTRACT(HOUR FROM pd.timestamp::timestamp) AS hour -- Cast to timestamp
FROM 
    "ProductionData" pd
INNER JOIN 
    "ObbOperation" oo ON pd."obbOperationId" = oo.id
INNER JOIN 
    "ObbSheet" os ON oo."obbSheetId" = os.id
INNER JOIN 
    "Operation" o ON o.id = oo."operationId"
WHERE 
    os.id = ${obbsheetid}
    AND pd.timestamp LIKE ${date}
GROUP BY 
    o.name, 
    oo.target, 
    oo."seqNo", 
    EXTRACT(HOUR FROM pd.timestamp::timestamp) -- Grouping by hour
ORDER BY 
    oo."seqNo", 
    hour;  -- Ordering by sequence number and hour
`;

    //console.log("data fetched",data,111)
    console.log("data",obbsheetid,date)


 
    return new Promise((resolve) => resolve(data  ))
}