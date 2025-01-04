

"use server";
import { createPostgresClient } from "@/lib/postgres";
import { neon } from "@neondatabase/serverless";




export type ProductionData = {
    counts: number; // Total production count (SUM of productionCount)
    operator: string;   // Name of the operator
    operation: string; // ID of the operation in the OBB sheet
    operationName: string;   // Name of the operation
    smv: number;    // Standard Minute Value (SMV) for the operation
  };


  export type getCountType = {

    production_date: string;

    operatorRfid: string;

    daily_total: number;

    name: string;
    LoginDate:string;
    smv : number


}; 


export interface newData {
    obbOperationId: string;
    LoginTimestamp: Date;
    LogoutTimestamp: Date;
    operation: string;
    smv: number;
    production_date: Date;
    daily_production: number;
    type: string;
    obbSheetId:string
}

export type getDateTypes = {

    operatorRfid: string;

    LoginTimestamp: Date;

    LogoutTimestamp: Date;

    date: string;
    LoginDate:string;

};




export async function getNewData(startdate :string,enddate :string,operatorId:string)  : Promise<newData[]>   {
    

    {
        const client = createPostgresClient();
      try {
    
        await client.connect();
        const query = `
         SELECT 
    o.name,
    o.rfid,
    pd."obbOperationId",
    SUM(pd."productionCount") AS daily_production,
    DATE(pd.timestamp) AS production_date,
    os."LoginTimestamp",
    os."LogoutTimestamp",
    SUBSTRING("LoginTimestamp" FROM 1 FOR 10) AS "LoginDate",
    oo.smv,opn.name operation,oo."obbSheetId", o."employeeId"
FROM 
    "Operator" o
INNER JOIN 
    "OperatorSession" os ON os."operatorRfid" = o.rfid
INNER JOIN 
    "ProductionData" pd ON pd."operatorRfid" = o.rfid
    AND pd.timestamp BETWEEN os."LoginTimestamp" AND os."LogoutTimestamp"  -- Ensure production data is within login-logout period
INNER JOIN "ObbOperation" oo on oo.id = pd."obbOperationId"
INNER JOIN "Operation" opn on opn.id = oo."operationId"
inner join "ObbSheet" obs on obs.id = oo."obbSheetId"


WHERE 
    o.id = $3
    AND pd.timestamp BETWEEN $1 AND $2  -- Ensure production data is within the desired period
    AND os."LoginTimestamp" BETWEEN $1 AND $2  -- Ensure sessions are within the desired period
GROUP BY  
    o.name,
    o.rfid,
    pd."obbOperationId",
    DATE(pd.timestamp),  -- Use DATE expression directly in GROUP BY
    os."LoginTimestamp",
    os."LogoutTimestamp",
    oo.smv,operation,oo."obbSheetId", o."employeeId"
ORDER BY 
    production_date;
        `;
        const values = [startdate,enddate,operatorId];
    
        const result = await client.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as newData[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
        await client.end()
      }}


  
}


export interface EmployeeRecord {
    id: string;
    name: string;
    employeeId: string;
    rfid: string;
    ts: Date;
    type: string;
}

export async function getEmployee()  : Promise<EmployeeRecord[]>   {
    
    const sql = neon(process.env.DATABASE_URL || "");
   
    // date=date+"%"
    const data = await sql
    `
    select id,name,"employeeId",rfid from "Operator"




`;
// console.log(startDate,endDate)


return new Promise((resolve) => resolve(data as EmployeeRecord[]  ))
}



