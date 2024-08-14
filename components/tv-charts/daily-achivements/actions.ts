"use server";
import { ProductionDataType } from "@/app/(dashboard)/analytics/daily-achivement/components/analytics-chart";
import { neon } from "@neondatabase/serverless";


export async function getData(lineid:string) : Promise<string>   {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`SELECT o.id FROM "ProductionLine" as pl INNER JOIN  "ObbSheet"  o ON pl."id" = o."productionLineId"
    WHERE o."isActive"=true and pl.name=${lineid}  ORDER BY  o."updatedAt" ASC LIMIT 1`;
    // INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    console.log("data",data,)
    console.log(data.length)
    if (data.length>0  ) 
    {
        return new Promise((resolve) => resolve(data[0].id ))
    }
    else{
        return new Promise((resolve) => resolve( "0" ))
        
    }
 
    
}