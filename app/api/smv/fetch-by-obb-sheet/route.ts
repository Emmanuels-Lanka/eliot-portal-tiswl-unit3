import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { db } from "@/lib/db";

export async function GET(
    req: Request
) {
    const sql = neon(process.env.DATABASE_URL || "");
    const url = new URL(req.url);
    const obbSheetId = url.searchParams.get('obbSheetId');
    const date = url.searchParams.get('date');

    if (!obbSheetId || !date) {
        return new NextResponse("Missing required parameters: obbSheetId or date", { status: 409 })
    }

    const startDate = `${date} 00:00:00`; // Start of the day
    const endDate = `${date} 23:59:59`; // End of the day



    try {
        // const smv = await db.productionSMV.findMany({
        //     where: {
        //         obbOperation: {
        //             obbSheetId
        //         },
        //         timestamp: {
        //             gte: startDate,
        //             lte: endDate
        //         }
        //     },
        //     include: {
        //         obbOperation: {
        //             select: {
        //                 smv: true,
        //                 operation: {
        //                     select: {
        //                         name: true,
        //                         code: true,
        //                     }
        //                 }
        //             }
        //         }
        //     },
        //     orderBy: {
        //         id: "asc"
        //     }
        // });
 const smv = await sql `SELECT 
    p.id,
    o.smv,
    op.name,
    op.code
FROM 
    "ProductionSMV" p
JOIN 
    "ObbOperation" o ON p."obbOperationId" = o.id
JOIN 
    "Operation" op ON o."operationId" = op.id
WHERE 
    o."obbSheetId" = ${obbSheetId}
    AND p.timestamp >=${startDate}
    AND p.timestamp <= ${endDate }
ORDER BY 
    p.id ASC;`
        console.log("SMV Data",smv)
        return NextResponse.json({ data: smv, message: 'SMV data fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[FETCH_SMV_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}