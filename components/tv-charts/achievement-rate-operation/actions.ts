"use server";
import { createPostgresClient } from "@/lib/postgres";
import { neon } from "@neondatabase/serverless";

export async function getObbSheetID(linename: string): Promise<string> {

  
  {
    const client = createPostgresClient();
try {

  await client.connect();
  const query = `
     SELECT oo.id
  FROM "ProductionLine" pl 
  INNER JOIN "ObbSheet" oo 
  ON pl.id = oo."productionLineId"
  WHERE oo."isActive"=true and pl.name=$1
  order by oo."createdAt" desc
  `;
  const values = [linename];

  const result = await client.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows[0].id));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  await client.end()
}
}

}