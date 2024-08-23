"use server";
import { neon } from "@neondatabase/serverless";



export async function getHrSmv(obbOperationId:string,date:string) : Promise<ProductionSMVDataTypes[]>   {
    const sql = neon(process.env.DATABASE_URL || "");
     const newdate= `${date}%`

     //first query
    const data = await sql`SELECT p.id, 
       p."obbOperationId", 
       p.timestamp,
       o.smv AS "obbOperationSmv",
       op.name AS "operationName",
       op.code AS "operationCode"
        FROM "productionSMV" p
        JOIN "obbOperation" o ON p."obbOperationId" = o.id
        JOIN operation op ON o."operationId" = op.id
        WHERE p."obbOperationId" = ${obbOperationId}
          AND p.timestamp >= ${newdate}
         ORDER BY p.id ASC;`;

    console.log("data",data,)


//second query
    const tsmv=await sql`SELECT smv
          FROM "obbOperation"
          WHERE id = ${obbOperationId}
          LIMIT 1;`

          console.log("tsmv",tsmv)
    return new Promise((resolve) => resolve(data as ProductionSMVDataTypes[] ))
}