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

export type OperatorRfidData = {

    operatorRfid: string;

    login: string;

    logout: string;

    offStandTime: string;

    name: string;

    sum: number;

    operation: string;

    smv: number;
    eid:string

};



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

export async function getFinalData(date:string,obbSheet:string) : Promise<OperatorRfidData[]>  {
    // date:string,obbSheet:string
    const sql = neon(process.env.DATABASE_URL || "");

    
     const data = await sql
     `
    select oet."operatorRfid", MIN(oet."loginTimestamp") AS login,
    MAX(oet."logoutTimestamp") AS logout,oet."offStandTime",o.name,
    sum(pd."productionCount"),opn.name operation,oo.smv,o."employeeId" eid
    
    from "OperatorEffectiveTime" oet
inner join "Operator" o on o."rfid" = oet."operatorRfid"
inner join "ProductionData" pd on pd."operatorRfid" = o."rfid"
inner join "ObbOperation" oo on oo."id" = pd."obbOperationId"
inner join "Operation" opn on opn."id" = oo."operationId"



where oet."loginTimestamp" like ${date+"%"} and pd."timestamp" like ${date+"%"} 
and oo."obbSheetId" = ${obbSheet} AND oet."logoutTimestamp" IS NOT NULL

group by oet."operatorRfid",oet."offStandTime",o.name,operation,oo.smv,eid
order by oet."operatorRfid"

`
    return new Promise((resolve) => resolve(data as OperatorRfidData[]))
}