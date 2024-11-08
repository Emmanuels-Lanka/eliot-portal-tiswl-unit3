"use server";
import { neon } from "@neondatabase/serverless";
import { ReportData } from "../../analytics/daily-report/_components/daily-report";
import { learnCurveData } from "./curve-graph";

type defects= {
    count:number;
    operator:string;
    part:string
}
type defcount= {
    total:number;

}


export async function getEfficiency(date:string,obbSheet:string,operatorId:string) : Promise<learnCurveData[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    console.log("first",date,obbSheet,operatorId)
    // obbsheetid:string,date:string
    
     const data = await sql`SELECT 
    DATE(pd."timestamp") AS day,  -- Group by each day for the learning curve
    oo."seqNo", 
    SUM(pd."productionCount") AS count, 
    o.name AS name, 
    opn.name AS operation, 
    oo.smv AS smv, 
    os.first_login AS first,
    MAX(pd."timestamp") AS last
FROM 
    "ProductionData" pd 
INNER JOIN 
    "Operator" o ON o.rfid = pd."operatorRfid"
INNER JOIN 
    "ObbOperation" oo ON oo.id = pd."obbOperationId"
INNER JOIN 
    "Operation" opn ON opn.id = oo."operationId"
LEFT JOIN (
    SELECT 
        "operatorRfid",
        DATE("LoginTimestamp") AS login_date,  -- Extract date part for daily grouping
        MIN("LoginTimestamp") AS first_login
    FROM "OperatorSession"
    WHERE DATE("LoginTimestamp") < CURRENT_DATE  -- Ensure type consistency with date
    GROUP BY "operatorRfid", DATE("LoginTimestamp")  -- Group by operator and date
) AS os ON os."operatorRfid" = o.rfid AND DATE(pd."timestamp") = os.login_date  -- Join on date
WHERE 
    DATE(pd."timestamp") < CURRENT_DATE  -- Ensure type consistency with date
    AND o.id = ${operatorId}
GROUP BY 
    day, oo."seqNo", o.name, opn.name, oo.smv, os.first_login
ORDER BY 
    day, oo."seqNo";




`
    
console.log("id",operatorId)

return new Promise((resolve) => resolve(data as learnCurveData[]  ))
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
