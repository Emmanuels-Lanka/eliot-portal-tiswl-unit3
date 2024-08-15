"use server";
import { neon } from "@neondatabase/serverless";

export async function getData(linename:string) :Promise<string>{
  const sql = neon(process.env.DATABASE_URL || "");
  console.log("linename",linename,)
  const data = await sql`
  SELECT oo.id
  FROM "ProductionLine" pl 
  INNER JOIN "ObbSheet" oo 
  ON pl.id = oo."productionLineId"
  WHERE oo."isActive"=true and pl.name=${linename}
  order by oo."updatedAt" asc
`;

  console.log("data",data.length)
  
  if(data.length>0){
    return new Promise((resolve) => resolve(data[1].id))

  }
  else{
  return new Promise((resolve) => resolve(""))
   
  }
}