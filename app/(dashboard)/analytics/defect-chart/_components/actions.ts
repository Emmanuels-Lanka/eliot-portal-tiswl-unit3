"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./analytics-chart";
import { defectData } from "./bar-chart-graph";


export async function getOperatorEfficiency(obbsheetid:string,date:string) : Promise<defectData[]>   {
    const sql = neon(process.env.RFID_DATABASE_URL || "");

    
     const data = await sql`SELECT
    pd."part",
    COUNT(DISTINCT pd."gmtId") AS garment_count
FROM 
    "GmtDefect" pd
LEFT JOIN  
    "_GmtQC" gdd ON gdd."B" = pd.id
LEFT JOIN
    "Defect" d ON d.id = gdd."A"
WHERE
    pd."qcStatus" <> 'pass'
    AND pd."obbSheetId" = ${obbsheetid}
    AND pd."timestamp" LIKE ${date}
GROUP BY 
    pd."part"

UNION ALL

SELECT
    pd."part",
    COUNT(DISTINCT pd."productId") AS garment_count
FROM 
    "ProductDefect" pd
LEFT JOIN  
    "_GmtQC" gdd ON gdd."B" = pd.id
LEFT JOIN
    "Defect" d ON d.id = gdd."A"
WHERE
    pd."qcStatus" <> 'pass' 
    AND pd."obbSheetId" = ${obbsheetid}
    AND pd."timestamp" LIKE ${date}
GROUP BY 
    pd."part";
`
    
            console.log(data)
    
    
    return new Promise((resolve) => resolve(data as defectData[] ))
}