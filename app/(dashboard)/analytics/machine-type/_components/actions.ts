"use server";
import { poolForPortal } from "@/lib/postgres";


import { db } from "@/lib/db";

// import { ProductionDataType } from "./analytics-chart";

export async function getOperatorEfficiency(obbsheetid:string,date:string,timeValue:string)    {
    try {
  
        const query = `
        Select count(*) ,"machineType" as type, pl.name as lineName,
count(case when sm."isAssigned" = false then 1 end) as notAssigned
from "SewingMachine" sm
inner join "ObbOperation" oo ON oo."sewingMachineId" = sm.id
inner join "ObbSheet" os ON os.id = oo."obbSheetId"
inner join "ProductionLine" pl on pl.id = os."productionLineId" 
group by type,lineName
        `;
        // const values = [obbSheet];
    
        const result = await poolForPortal.query(query,);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as any[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
   
   

}



export async function getMachineTypes  (obbSheetId:string) {

  const machines = await db.sewingMachine.findMany({
    select:{
      machineType: true,
      brandName:true,
      isAssigned:true
    },
    where:{
      obbOperations:{
        some:{
          obbSheetId:obbSheetId
        }
      }
  }})


  console.log("first",machines)
      return { data: machines,  message: "Production data fetched successfully" };

}

