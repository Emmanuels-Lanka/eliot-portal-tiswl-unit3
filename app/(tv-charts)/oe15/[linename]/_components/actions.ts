"use server";
import { createPostgresClient } from "@/lib/postgres";
import { neon } from "@neondatabase/serverless";

export async function getOperatorEfficiencyData15M(obbsheetid:string,date:string)   {
    
  {
    const client = createPostgresClient();
try {

  await client.connect();
  const query = `
    select CONCAT(SUBSTRING(CONCAT('(', opn."code", ')', '-', oprtr.name) FROM 1 FOR 25), ' ', '(', sm."machineId", ') - ',obbopn."seqNo") AS name,
    pd."productionCount" as count, obbopn.target,pd.timestamp as timestamp,obbopn.smv
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
    INNER JOIN "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
    INNER JOIN "Operator" oprtr ON oprtr."rfid" = pd."operatorRfid"
    INNER JOIN "Operation" opn ON opn."id" = obbopn."operationId"
     INNER JOIN 
      "SewingMachine" sm ON sm.id = obbopn."sewingMachineId"
    WHERE pd.timestamp like $2 and  obbs.id = $1
    group by CONCAT(SUBSTRING(CONCAT('(', opn."code", ')', '-', oprtr.name) FROM 1 FOR 25), ' ', '(', sm."machineId", ') - ',obbopn."seqNo"),obbopn.target, pd."productionCount",pd.timestamp,obbopn.smv
    order by  pd.timestamp 
  `;
  const values = [obbsheetid,date];

  const result = await client.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows ));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  await client.end()
}
}    
}


export async function geOperatorList(obbsheetid:string,date:string ) : Promise<any[]>  {

  {
    const client = createPostgresClient();
try {

  await client.connect();
  const query = `
    SELECT 
      CONCAT(SUBSTRING(CONCAT('(', opn."code", ')', '-', oo.name) FROM 1 FOR 25), ' ', '(', sm."machineId", ') - ',oopn."seqNo") AS name
    FROM 
      "Operator" oo  
    INNER JOIN 
      "ProductionData" pd ON oo."rfid" = pd."operatorRfid"
    INNER JOIN 
      "ObbOperation" oopn ON pd."obbOperationId" = oopn."id"
    INNER JOIN 
      "ObbSheet" os ON oopn."obbSheetId" = os.id
    INNER JOIN 
      "Operation" opn ON opn."id" = oopn."operationId"
    INNER JOIN 
      "SewingMachine" sm ON sm.id = oopn."sewingMachineId"
    WHERE 
      os.id = $1  
      AND pd.timestamp LIKE $2
    GROUP BY 
      CONCAT(SUBSTRING(CONCAT('(', opn."code", ')', '-', oo.name) FROM 1 FOR 25), ' ', '(', sm."machineId", ') - ',oopn."seqNo"), 
      oopn."seqNo"
    ORDER BY 
      oopn."seqNo";
  `;
  const values = [obbsheetid,date];

  const result = await client.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows ));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  await client.end()
}
}    
}