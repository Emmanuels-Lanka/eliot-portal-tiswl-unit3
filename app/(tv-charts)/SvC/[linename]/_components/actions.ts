
"use server";
import { SMVChartData } from "@/app/(dashboard)/analytics/operation-smv/_components/analytics-chart";
import { poolForPortal } from "@/lib/postgres";

export async function getObbSheetID(obbSheetId: string): Promise<{id:string, name:string}> {

  
  {
   
try {

 
  const query = `
     SELECT oo.id,oo.name
  FROM "ProductionLine" pl 
  INNER JOIN "ObbSheet" oo 
  ON pl.id = oo."productionLineId"
  WHERE oo."isActive"=true and oo.id=$1
  order by oo."createdAt" desc
  `;
  const values = [obbSheetId];

  const result = await poolForPortal.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows[0] as {id:string, name:string}));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
 
}
}

}

export async function getSMV(obbSheetId:String,date:String):Promise<SMVChartData[]> {


  const datef = `${date}%`; 

  {
  
  try {

    const query = `
      SELECT 
    o.smv,
    concat(o."seqNo",' - ',op.name) as name,
    o."seqNo",
    AVG(CAST(p.smv AS NUMERIC)) AS avg,
    sm."machineId"
FROM 
    "ProductionSMV" p
JOIN 
    "ObbOperation" o ON p."obbOperationId" = o.id
JOIN 
    "Operation" op ON o."operationId" = op.id
inner JOIN "SewingMachine" sm ON sm."id"= o."sewingMachineId"
WHERE 
    o."obbSheetId" = $1
    AND p.timestamp like $2
    and p.smv <> '0.00'
group by  o.smv,
    op.name,
    o."seqNo",
    sm."machineId" 
ORDER BY 
     o."seqNo" ASC;
    `;
    const values = [obbSheetId,datef];

    const result = await poolForPortal.query(query, values);

    // console.log("DATAaa: ", result.rows);
    return new Promise((resolve) => resolve(result.rows as SMVChartData[]));
    
    
  } catch (error) {
    console.error("[TEST_ERROR]", error);
    throw error;
  }
  finally{

  }}

}