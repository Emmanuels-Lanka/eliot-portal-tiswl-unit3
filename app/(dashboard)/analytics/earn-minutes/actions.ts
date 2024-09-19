"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./components/analytics-chart";

export async function getData(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`SELECT SUM(pd."productionCount") as count,concat(oo."seqNo",'-',o.name ) as name ,oo.target
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    INNER JOIN "Operation" o ON o.id= oo."operationId"
    WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
    group by o.name,oo.target,oo."seqNo" order by  oo."seqNo" ;`;

    //console.log("data fetched",data,111)


 
    return new Promise((resolve) => resolve(data as ProductionDataType[] ))
}

export async function getSMV() {
    
    const sql = neon(process.env.DATABASE_URL || "");
  
    // const datef = `${date}%`; // Start of the day

  
  const smv = await sql`SELECT 
      o.smv,
      concat(o."seqNo",'-',op.name) as name,
      o."seqNo",   
      AVG(CAST(pd.smv AS NUMERIC)) AS avg
      
  FROM 
      "ProductionData" p
  JOIN 
      "ObbOperation" o ON p."obbOperationId" = o.id
  JOIN 
      "Operation" op ON o."operationId" = op.id
  inner JOIN "SewingMachine" sm ON sm."id"= o."sewingMachineId"
  INNER JOIN "ProductionSMV" pd ON pd."obbOperationId" = o.id
  WHERE 
      o."obbSheetId" = 'm0uk89ef-wleHBGo6tNxf'
      AND p.timestamp like '2024-09-17%'
  group by  o.smv,
      op.name,
      o."seqNo"
     
  ORDER BY 
       o."seqNo" ASC;`
    console.log("SMV Data",smv)


    // the old one
//   const smv = await sql`SELECT 
//       o.smv,
//       concat(o."seqNo",' - ',op.name) as name,
//       o."seqNo",
//       AVG(CAST(p.smv AS NUMERIC)) AS avg,
//       sm."machineId"
//   FROM 
//       "ProductionSMV" p
//   JOIN 
//       "ObbOperation" o ON p."obbOperationId" = o.id
//   JOIN 
//       "Operation" op ON o."operationId" = op.id
//   inner JOIN "SewingMachine" sm ON sm."id"= o."sewingMachineId"
//   WHERE 
//       o."obbSheetId" = 'm0uk89ef-wleHBGo6tNxf'
//       AND p.timestamp like '2024-09-17%'
//   group by  o.smv,
//       op.name,
//       o."seqNo",
//       sm."machineId" 
//   ORDER BY 
//        o."seqNo" ASC;`
//     console.log("SMV Data",smv)
  
    return new Promise((resolve) => resolve(smv))
  }



  export async function getProduction() {
    
    const sql = neon(process.env.DATABASE_URL || "");
  
    // const datef = `${date}%`; // Start of the day

  
  const smv = await sql`SELECT SUM(pd."productionCount") as count,concat(oo."seqNo",'-',o.name ) as name 
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    INNER JOIN "Operation" o ON o.id= oo."operationId"
    WHERE os.id = 'm0uk89ef-wleHBGo6tNxf' and  pd.timestamp like '2024-09-17 08:%'
    group by o.name,oo."seqNo" order by  oo."seqNo" ASC ;`
    console.log("SMV Data",smv)



  
    return new Promise((resolve) => resolve(smv))
  }