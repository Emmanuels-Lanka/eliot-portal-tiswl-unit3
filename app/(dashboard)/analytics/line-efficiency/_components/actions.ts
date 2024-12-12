"use server";
import { neon } from "@neondatabase/serverless";
import { DataRecord, EfficiencyData } from "./barchart";
import { ObbSheet } from "@prisma/client";

type defects= {
    count:number;
    operator:string;
    part:string
}
type defcount= {
    total:number;

}

type obb = ObbSheet &{
    unit:string;
    line:string

}

export async function getChecked(date:string,obbSheet:string) : Promise<defcount>   {
    const sql = neon(process.env.RFID_DATABASE_URL || "");
    // obbsheetid:string,date:string
    
     const data = await sql
     `WITH counts AS (
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
export async function getDefects(date:string,obbSheet:string) : Promise<defects []>   {
    const sql = neon(process.env.RFID_DATABASE_URL || "");
    // obbsheetid:string,date:string
    
     const data = await sql
     `select count(*),"operatorName" as operator,part from "GmtDefect" 
where timestamp like ${date} and "obbSheetId" = ${obbSheet}
and "qcStatus" <> 'pass'
group by operator,part
union
select count(*),"operatorName" as operator,part  from "ProductDefect"
where "qcStatus" <> 'pass' and  timestamp like ${date} and "obbSheetId" = ${obbSheet}
group by operator,part


`
    
    
    
    return new Promise((resolve) => resolve(data as defects[]  ))
}
export async function getData(date:string,obbSheet:string) : Promise<any []>   {
    const sql = neon(process.env.RFID_DATABASE_URL || "");
    // obbsheetid:string,date:string
    
     const data = await sql
     `select count(*),"operatorName" as operator,part from "GmtDefect" 
where timestamp like ${date} and "obbSheetId" = ${obbSheet}
and "qcStatus" <> 'pass'
group by operator,part
union
select count(*),"operatorName" as operator,part  from "ProductDefect"
where "qcStatus" <> 'pass' and  timestamp like ${date} and "obbSheetId" = ${obbSheet}
group by operator,part


`
    
    
    
    return new Promise((resolve) => resolve(data as any[]  ))
}

export async function getObbData(obbSheet:string) : Promise< obb[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql
     `
    select u.name unit, pl."name" line,os.* from "Unit" u
inner join "ProductionLine" pl on pl."unitId" = u.id
inner join "ObbSheet" os on os."productionLineId" = pl.id
where os.id = ${obbSheet}

`
    return new Promise((resolve) => resolve(data as obb[]))
}
export async function getUnit() : Promise<{ id: string; name: string }[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql`
     select id as id , name as name from "Unit" u 


 order by "createdAt" desc

`
    return new Promise((resolve) => resolve(data as { id: string; name: string }[]))
}

export async function getEfficiencyData(date:string) : Promise<EfficiencyData[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql
     `
    select "operatorRfid",o.name name,MIN("loginTimestamp") login,max("logoutTimestamp") logout,"offStandTime" from "OperatorEffectiveTime" oet
    inner join "Operator" o on o."rfid" = oet."operatorRfid"
    where "loginTimestamp" like ${date+"%"} and "logoutTimestamp" IS NOT NULL
    group by "operatorRfid","offStandTime",o.name
    order by "operatorRfid"
`
    return new Promise((resolve) => resolve(data as EfficiencyData[]))
}
export async function getProducts(date:string,obbSheet:string) : Promise<DataRecord[]>  {
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql
     `
 select oo."seqNo",pd."operatorRfid",o.name name,opn."name" operation,oo.smv,sum(pd."productionCount") count,oo."obbSheetId" from "ProductionData" pd 
inner join "Operator" o on o.rfid = pd."operatorRfid"
inner join "ObbOperation" oo on oo.id = pd."obbOperationId"
inner join "Operation" opn on opn.id = oo."operationId"
INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id 
where pd.timestamp like ${date+"%"} and os.id = ${obbSheet}
group by pd."operatorRfid",o.name,oo.smv,oo."seqNo",opn."name",oo."obbSheetId"
order by oo."seqNo"
`
    return new Promise((resolve) => resolve(data as DataRecord[]))
}