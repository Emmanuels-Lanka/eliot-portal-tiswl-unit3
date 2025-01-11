import { NextResponse } from "next/server";
import DATA from "./line.json";

import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const results = await Promise.all(DATA.map(async (data) => {
            const res = await db.productionLine.create({
                data: {
                    ...data,
                    machines: {
                        connect: data.machines.map((m) => ({ id: m.id }))
                    }
                },
            });
            return res;
        }));
        console.log("COUNT:", results.length);

        return NextResponse.json(results.length, { status: 201 });
    } catch (error) {
        console.error("[UPDATE_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}