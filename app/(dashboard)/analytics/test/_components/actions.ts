"use server";
import { neon } from "@neondatabase/serverless";


export async function getData()  : Promise<any[]>{
    const sql = neon(process.env.DATABASE_URL || "");
    //,pd."eliotSerialNumber" as eliotid
    const data = await sql
        `select os.id,"factoryStartTime" start from "ProductionData" pd
inner join "ObbOperation" oo on oo.id = pd."obbOperationId"
inner join "ObbSheet" os on os.id = oo."obbSheetId"
where pd.timestamp like '2024-12-12%' and  oo."obbSheetId" = 'm3les5hd-0QqhlRye5b56'
group by os.id,start

`;

 


 
    return new Promise((resolve) => resolve(data ))
}

export async function getDataRfid()  : Promise<any[]>{
    const sql = neon(process.env.RFID_DATABASE_URL || "");
    //,pd."eliotSerialNumber" as eliotid
    const data = await sql
        `select count(pd."productId"),ler."totalSMV","obbManPowers",ler."obbSheetId" obbSheetId from "ProductDefect" pd
inner join "LineEfficiencyResources" ler on ler."obbSheetId" = pd."obbSheetId"

where timestamp  like  '2024-12-12%'  and pd."qcStatus" = 'pass' and pd."obbSheetId" ='m3les5hd-0QqhlRye5b56'
and pd."part" = 'line-end'

group by ler."totalSMV","obbManPowers",ler."obbSheetId"
`;

 


 
    return new Promise((resolve) => resolve(data ))
}
