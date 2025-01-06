import { NextResponse } from "next/server";
import DATA from "./data.json";

import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const results = await Promise.all(DATA.map(async (data) => {
            const res = await db.productionData.create({
                data: {
                    id: data.id,
                    operatorRfid: data.operatorRfid,
                    eliotSerialNumber: data.eliotSerialNumber,
                    productionCount: data.productionCount,
                    timestamp: data.timestamp,
                    obbOperationId: data.obbOperationId,
                },
            });
            return res;
        }));

        return NextResponse.json(results.length, { status: 201 });
    } catch (error) {
        console.error("[UPDATE_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}