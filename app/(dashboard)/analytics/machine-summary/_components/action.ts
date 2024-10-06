"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./LogTable";


export async function getData(obbsheetid:string,date:string,unitId:string)  : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    console.log(unitId)

    const data = await sql`Select CAST(count(*) AS int) ,"machineType" as type, pl.name as lineName,
CAST(count(case when sm."isAssigned" = false then 1 end)AS int) as notAssigned
from "SewingMachine" sm
inner join "ObbOperation" oo ON oo."sewingMachineId" = sm.id
inner join "ObbSheet" os ON os.id = oo."obbSheetId"
inner join "ProductionLine" pl on pl.id = os."productionLineId" 
inner join "Unit" u on u.id= pl."unitId"
where u.name=${unitId}

group by type,lineName`;

     


 
    return new Promise((resolve) => resolve(data as ProductionDataType[]  ))
}
export async function getDatas(obbsheetid:string,date:string)  : Promise<ProductionDataType[]>   {
  const sql = neon(process.env.DATABASE_URL || "");

  const data = await sql`Select count(*),"machineType" as type
from "SewingMachine" sm
inner join "ObbOperation" oo ON oo."sewingMachineId" = sm.id
inner join "ObbSheet" os ON os.id = oo."obbSheetId"
inner join "ProductionLine" pl on pl.id = os."productionLineId" 
group by type`;

   



  return new Promise((resolve) => resolve(data as ProductionDataType[]  ))
}




// "use server";
// import { neon } from "@neondatabase/serverless";
// import { ProductionDataType } from "./LogTable";


// export async function getData(obbsheetid:string,date:string)  : Promise<ProductionDataType[]>   {
//     const sql = neon(process.env.DATABASE_URL || "");

//     const data = await sql`SELECT 
//   oprt.name, 
//   oprt."employeeId", 
//   opn.name AS operationname, 
//   opn.code, 
//   pd."eliotSerialNumber", 
//   SUM(pd."productionCount") AS totprod, 
//   obbopn.target, 
//   obbopn."seqNo", 
//   sm."machineId", 
//   null as "LoginTimestamp", 
//   null  as "LogoutTimestamp"
// FROM 
//   "ProductionData" pd
//   INNER JOIN "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
//   INNER JOIN "Operation" opn ON opn.id = obbopn."operationId"
//   INNER JOIN "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
//   INNER JOIN "SewingMachine" sm ON sm.id = obbopn."sewingMachineId"
//   INNER JOIN "Operator" oprt ON oprt.rfid = pd."operatorRfid"
//   INNER JOIN "OperatorSession" opses ON opses."operatorRfid" = oprt."rfid"
// WHERE 
//   pd.timestamp LIKE ${date} 
//   AND obbs.id = ${obbsheetid}
//   AND  opses."LoginTimestamp" LIKE ${date} 
// GROUP BY 
//   sm."machineId", 
//   pd."eliotSerialNumber", 
//   opn.name, 
//   opn.code, 
//   obbopn."seqNo", 
//   obbopn.target, 
//   oprt.name, 
//   oprt."employeeId",
//   obbopn."seqNo"
//   ORDER BY 
//   obbopn."seqNo";`;

     


 
//     return new Promise((resolve) => resolve(data as ProductionDataType[]  ))
// }