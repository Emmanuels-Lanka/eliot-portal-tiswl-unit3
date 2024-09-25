"use server";
import { ProductionDataType } from "@/app/(dashboard)/analytics/daily-achivement/components/analytics-chart";
import { neon } from "@neondatabase/serverless";

export async function getObbID(linename: string): Promise<string> {
  const sql = neon(process.env.DATABASE_URL || "");

  const data = await sql`
  SELECT oo.id
  FROM "ProductionLine" pl 
  INNER JOIN "ObbSheet" oo 
  ON pl.id = oo."productionLineId"
  WHERE oo."isActive"=true and pl.name=${linename}
  order by oo."createdAt" desc
`;

  console.log("data", data);
  console.log(data.length);
  if (data.length > 0) {
    return new Promise((resolve) => resolve(data[0].id));
  } else {
    return new Promise((resolve) => resolve("0"));
  }
}

// export async function getProducts(
//   obbsheetid: string,
//   date: string
// ): Promise<ProductionDataType[]> {
//   const sql = neon(process.env.DATABASE_URL || "");

//   const data =
//     await sql`SELECT Max(pd."productionCount") as count,o.code as name   ,oo.target
//             FROM "ProductionData" pd
//             INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
//             INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
//             INNER JOIN "Operation" o ON o.id= oo."operationId"
//             WHERE os.id = ${obbsheetid} and pd.timestamp like ${date}
//             group by o.code,oo."seqNo",oo.target order by  oo."seqNo" ;`;
//   //console.log("data",data,)

//   console.log("aaaa", data);

//   return new Promise((resolve) => resolve(data as ProductionDataType[]));
// }
