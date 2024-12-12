"use server";
import { neon } from "@neondatabase/serverless";


export async function getData()  : Promise<any[]>{
    const sql = neon(process.env.DATABASE_URL || "");
    //,pd."eliotSerialNumber" as eliotid
    const data = await sql
    `select os.id,name,"factoryStartTime" start,"totalSMV",sum(pd."productionCount") count from "ObbSheet" os
inner join "ObbOperation" oo on oo."obbSheetId" = os.id
inner join "ProductionData" pd on pd."obbOperationId" = oo.id
where oo."obbSheetId" = 'm3les5hd-0QqhlRye5b56' and pd."timestamp" like '2024-12-10%'
group by os.id,name,"factoryStartTime","totalSMV"

`;

 


 
    return new Promise((resolve) => resolve(data ))
}
