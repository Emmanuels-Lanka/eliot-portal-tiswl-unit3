import { NextResponse } from "next/server";

import { generateUniqueId } from "@/actions/generate-unique-id";
import { db } from "@/lib/db";
import DATA from "./data";

export async function POST(req: Request) {
    try {
        // const body: any[] = JSON.parse(DATA);
        // body.forEach(data => {
        //     delete data.createdAt;
        //     delete data.id;
        // })
        // console.log("RESTTT", body);

        const results = await Promise.all(DATA.map(async (data) => {
            const res = await db.obbOperation.create({
                data: {
                    id: data.id,
                    seqNo: data.seqNo,
                    operationId: data.operationId,
                    obbSheetId: data.obbSheetId,
                    smv: data.smv,
                    target: data.target,
                    spi: data.spi,
                    length: data.length,
                    totalStitches: data.totalStitches,
                    supervisorId: data.supervisorId,
                    isActive: data.isActive,
                    sewingMachineId: data.sewingMachineId,
                    part: data.part,
                    isCombined: data.isCombined,
                },
            });
            return res;
        }));

        return NextResponse.json(results, { status: 201 });
    } catch (error) {
        console.error("[UPDATE_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}