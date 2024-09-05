

"use server";
import { neon } from "@neondatabase/serverless";
import { ReportData } from "./report-table";




export async function getDailyData(obbsheetid:string,date:string)  : Promise<ReportData[]>   {
    
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`
    select 
    pl.name,
    obbs.buyer,
    obbs.style,
    obbop.smv,
    obbop.target,
    sum(pd."productionCount") as count,
    obbs."startingDate"
    from 
    "ObbOperation" obbop
    inner join "ProductionData" pd on pd."obbOperationId"=obbop.id
    inner join "ObbSheet" obbs on obbs.id=obbop."obbSheetId"
    inner join "ProductionLine" pl on pl.id=obbs."productionLineId"
    where pd."timestamp" LIKE ${date} AND obbs.id = ${obbsheetid}
    group by obbop.smv,obbop.target,obbs.buyer,pl.name,obbs."startingDate",obbs.style 
    `;

  
   console.log("fetched Data",data)

 
    return new Promise((resolve) => resolve(data as ReportData[]  ))
}


