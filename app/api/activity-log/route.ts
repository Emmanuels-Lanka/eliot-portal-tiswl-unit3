import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import moment from "moment-timezone";

export async function POST(
    req: Request
) {
    try {
        const { part, activity } = await req.json();
        const timezone = process.env.NODE_ENV === "development" ? "Asia/Colombo" : "Asia/Dhaka";
        const timestamp = moment().tz(timezone).toDate();

        const res = await db.activityLog.create({
            data: {
                part,
                activity,
                timestamp, // <-- your custom timestamp
            }
        });

        return NextResponse.json({ data: res, message: 'Successfully created activity log' }, { status: 200 });
    } catch (error) {
        console.error("[CREATE_ACTIVITY_LOG_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}