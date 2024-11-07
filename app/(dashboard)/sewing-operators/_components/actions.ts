"use server";
import { neon } from "@neondatabase/serverless";

type defects= {
    count:number;
    operator:string;
    part:string
}
type defcount= {
    total:number;

}

export async function getChecked(date:string,obbSheet:string) : Promise<defcount>   {
    const sql = neon(process.env.RFID_DATABASE_URL || "");

    console.log("first",date,obbSheet)
    // obbsheetid:string,date:string
    
     const data = await sql`WITH counts AS (
    SELECT COUNT(*) AS gmt_count FROM "GmtDefect" gd WHERE gd.timestamp LIKE ${date} 
    and "obbSheetId" = ${obbSheet}
    UNION ALL
    SELECT COUNT(*) AS product_count FROM "ProductDefect" pd WHERE pd.timestamp LIKE ${date}
    and "obbSheetId" = ${obbSheet}
)
SELECT SUM(gmt_count) AS total FROM counts;
`
    
const total = data[0]?.total || 0;
    
return { total } as defcount;
}
export async function getDefects(date:string,obbSheet:string,operatorId: string) : Promise<defects []>   {
    const sql = neon(process.env.RFID_DATABASE_URL || "");
    // obbsheetid:string,date:string
    
     const data = await sql`select count(*),"operatorName" as operator,part from "GmtDefect" gd
where timestamp like ${date} and "obbSheetId" =${obbSheet} and 
"qcStatus" <> 'pass' and gd."operatorId" = ${operatorId}
group by operator,part
union
select count(*),"operatorName" as operator,part  from "ProductDefect" pd
where "qcStatus" <> 'pass' and  timestamp like ${date} and "obbSheetId" = ${obbSheet}
and pd."operatorId" = ${operatorId}
group by operator,part


`
    
    
    
    return new Promise((resolve) => resolve(data as defects[]  ))
}
