"use server";
import { neon } from "@neondatabase/serverless";

export async function getOperatorEfficiencyData15M(obbsheetid:string,date:string)   {
    const sql = neon(process.env.DATABASE_URL || "");

    
    
     const data = await sql`SELECT concat(obbopn."seqNo",'-',oprtr.name ) as name,pd."productionCount" as count, obbopn.target,pd.timestamp as timestamp
            FROM "ProductionData" pd
            INNER JOIN "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
            INNER JOIN "Operation" opn ON opn.id= obbopn."operationId"
            INNER JOIN "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
            INNER JOIN "Operator" oprtr ON oprtr."rfid" = pd."operatorRfid"
            WHERE pd.timestamp like ${date} and  obbs.id = ${obbsheetid}
            group by oprtr.name,obbopn."seqNo",obbopn.target, pd."productionCount",pd.timestamp

            order by  obbopn."seqNo"`
    

    
    console.log("data",data,obbsheetid)
    return new Promise((resolve) => resolve(data  ))
    
}


export async function geOperatorList(obbsheetid:string ) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");
 
    // const data = await sql`SELECT   concat(oo."seqNo",'-',o.name ) as name

    const data = await sql`SELECT substring(concat(oopn."seqNo",'-',oo.name ) from 0 for 20)  as name
    FROM "Operator" oo  
    INNER JOIN "ProductionData" pd ON oo."rfid" = pd."operatorRfid"
    INNER JOIN "ObbOperation" oopn ON pd."obbOperationId" = oopn."id"
    INNER JOIN "ObbSheet" os ON oopn."obbSheetId" = os.id
    WHERE os.id = ${obbsheetid}  
    group by oo.name,oopn."seqNo"
    order by  oopn."seqNo";`;

    console.log("geOperationList",data,)


 
    return new Promise((resolve) => resolve(data ))
}