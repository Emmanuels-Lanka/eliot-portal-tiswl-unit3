"use server";
import { neon } from "@neondatabase/serverless";




export async function getObb(unit:any) : Promise<{ id: string; name: string }[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql`
    select os.name as name ,os.id as id from "ObbSheet" os 

inner join "Unit" u on u.id= os."unitId"

where os."unitId"=${unit}
 order by os."createdAt" desc

`
    return new Promise((resolve) => resolve(data as { id: string; name: string }[]))
}


export async function getOperationSmv(obbSheetId:string,date:string) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql`
      select os."seqNo",os.smv,o.name from "ObbOperation" os
inner join "Operation" o on o.id =os."operationId"

where os."obbSheetId" = ${obbSheetId}

order by os."seqNo"

`
// console.log(obbSheetId)
    return new Promise((resolve) => resolve(data as any []))
}


export async function getTargetValues(obbSheetId:string) : Promise<any[]>  {
    const sql = neon(process.env.RFID_DATABASE_URL || "");

    
     const data = await sql`
      select l."totalSMV" as tsmv,l."obbManPowers" from "LineEfficiencyResources" l
where l."obbSheetId" = ${obbSheetId}

`
console.log(obbSheetId)
    return new Promise((resolve) => resolve(data as any []))
}