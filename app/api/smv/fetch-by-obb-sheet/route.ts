import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
    req: Request
) {
    const url = new URL(req.url);
    const obbSheetId = url.searchParams.get('obbSheetId');
    const date = url.searchParams.get('date');

    if (!obbSheetId || !date) {
        return new NextResponse("Missing required parameters: obbSheetId or date", { status: 409 })
    }

    const startDate = `${date} 00:00:00`; // Start of the day
    const endDate = `${date} 23:59:59`; // End of the day

    try {
        const smv = await db.productionSMV.findMany({
            where: {
                obbOperation: {
                    obbSheetId
                },
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                obbOperation: {
                    select: {
                        smv: true,
                        operation: {
                            select: {
                                name: true,
                                code: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                id: "asc"
            }
        });

        return NextResponse.json({ data: smv, message: 'SMV data fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[FETCH_SMV_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}