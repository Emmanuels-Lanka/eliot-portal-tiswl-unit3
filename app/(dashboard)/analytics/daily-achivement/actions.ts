"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./components/analytics-chart";
import { createPostgresClient } from "@/lib/postgres";

export async function getData(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {

{
    const client = createPostgresClient();
  try {

    await client.connect();
    const query = `
      select SUM(pd."productionCount") as count
,concat(oo."seqNo",'-',o.name ) as name ,oo.target,sm."machineId" as machine
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    INNER JOIN "Operation" o ON o.id= oo."operationId"
    INNER JOIN "SewingMachine" sm on sm.id = oo."sewingMachineId"
    WHERE os.id = $1 and pd.timestamp like $2
    group by o.name,oo.target,oo."seqNo",machine order by  oo."seqNo" ;
    `;
    const values = [obbsheetid,date];

    const result = await client.query(query, values);

    // console.log("DATAaa: ", result.rows);
    return new Promise((resolve) => resolve(result.rows as ProductionDataType[]));
    
    
  } catch (error) {
    console.error("[TEST_ERROR]", error);
    throw error;
  }
  finally{
    await client.end()
  }}





}


export async function getExelData(obbsheetid:string,date:string)    {

    {
        const client = createPostgresClient();
      try {
    
        await client.connect();
        const query = `SELECT 
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
    os.id = $1
    AND pd.timestamp LIKE $2
GROUP BY 
    o.name, 
    oo.target, 
    oo."seqNo", 
    EXTRACT(HOUR FROM pd.timestamp::timestamp) -- Grouping by hour
ORDER BY 
    oo."seqNo", 
    hour;  -- Ordering by sequence number and hour
        `;
        const values = [obbsheetid,date];
    
        const result = await client.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as ProductionDataType[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
        await client.end()
      }}
  }