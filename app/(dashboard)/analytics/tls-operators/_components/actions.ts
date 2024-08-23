"use server";
import { neon } from "@neondatabase/serverless";


export async function   getDHUData(obbsheetid:string,date:string)   {
    const sql = neon(process.env.DATABASE_URL2 || "");

    console.log("dara",obbsheetid,"",date)
    const data = await sql`select count(*) as count ,"qcStatus" qc, "operatorName" as name from "GmtDefect"
    WHERE "qcStatus" <> 'pass' AND "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}
    group by "operatorName","qcStatus";`;

    console.log("data fetched",data)


    const tc = await sql`select count(*) as count from "GmtDefect"
    WHERE "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}`;

    // console.log("data fetched",data)
    console.log("Row Count",tc)
    const count  : number = Number(tc?.[0]?.count) ?? 1

    const res= data.map((d)=>(
        {
            ...d,count:(d.count/count)*100
        }
    ))



 
    return new Promise((resolve) => resolve(res  ))
}