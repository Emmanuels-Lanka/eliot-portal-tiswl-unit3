"use server";
import { neon } from "@neondatabase/serverless";
// import { ProductionDataType } from "./analytics-chart";

export async function getOperatorEfficiency(obbsheetid:string,date:string,timeValue:string)    {
    const sql = neon(process.env.DATABASE_URL || "");

    // date = date+" "+timeValue+":%"
    date = date+"%";
    // date=date+" 10:%";
    // 
    
     const data = await sql`Select count(*) ,"machineType" as type from "SewingMachine" sm

inner join "ObbOperation" oo ON oo."sewingMachineId" = sm.id
inner join "ObbSheet" os ON os.id = oo."obbSheetId"
where oo."obbSheetId" = ${obbsheetid}
group by type`
    
            
    
    
    return new Promise((resolve) => resolve(data ))
}



// export async function getSMV(obbsheetid:string,date:string,timeValue:string)    {
//     const sql = neon(process.env.DATABASE_URL || "");

//    date=date+"%";
// //    date = date+" "+timeValue+":%"

//     ///data avg is target smv and not the real one , change p.smv for the real one
    
//      const data = await sql`SELECT 
//     AVG(CAST(o.smv AS NUMERIC)) AS avg,
    
//      concat(o."seqNo",'-',op.name) as name,
//     o."seqNo"
   
// FROM 
//     "ProductionSMV" p
// JOIN 
//     "ObbOperation" o ON p."obbOperationId" = o.id
// JOIN 
//     "Operation" op ON o."operationId" = op.id

//   --INNER JOIN "ProductionSMV" pd ON pd."obbOperationId" = o.id
//   WHERE 
//       o."obbSheetId" = ${obbsheetid}
//       AND p.timestamp like ${date}
      
          
// group by name,o."seqNo"

// order by o."seqNo"`;
    
//             console.log(data)
    
    
//     return new Promise((resolve) => resolve(data  ))
// }