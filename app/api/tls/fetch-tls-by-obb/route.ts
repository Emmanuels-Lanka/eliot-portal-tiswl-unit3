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
        const tlsData = await db.trafficLightSystem.findMany({
            where: {
                obbOperation: {
                    obbSheetId: obbSheetId
                },
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                id: true,
                roundNo: true,
                operatorRfid: true,
                obbOperationId: true,
                colour: true,
                operator: {
                    select: {
                        name: true,
                        rfid: true
                    }
                },
                obbOperation: {
                    select: {
                        id: true,
                        operation: {
                            select: {
                                name: true
                            }
                        },
                    }
                }
            }
        });

        return NextResponse.json({ data: tlsData, message: 'TLS records fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[FETCH_TLS_BY_OBB_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}