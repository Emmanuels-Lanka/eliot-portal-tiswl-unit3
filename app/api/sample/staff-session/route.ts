import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { staffEmpId, obbOperationId } = await req.json();

        let id = generateUniqueId();
        const timestamp = "2024-04-21 11:38:44"

        const LogedInOperator = await db.staffSession.findMany({
            where: {
                staffEmpId,
                isLoggedIn: true
            }
        });
        
        if (LogedInOperator.length > 0) {
            const updatedSession = await db.staffSession.updateMany({
                where: {
                    staffEmpId,
                    isLoggedIn: true
                },
                data: {
                    isLoggedIn: false,
                    LogoutTimestamp: timestamp,
                }
            });
            return NextResponse.json({ data: updatedSession, message: 'Session updated successfully'}, { status: 201 });
        } else { 
            const createdSession = await db.staffSession.create({
                data: {
                    id,
                    staffEmpId,
                    LoginTimestamp: timestamp,
                    obbOperationId
                }
            });
            return NextResponse.json({ data: createdSession, message: 'Session created successfully'}, { status: 201 });
        }

    } catch (error) {
        console.error("[SESSION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}