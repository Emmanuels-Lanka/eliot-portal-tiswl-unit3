import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { operatorRfid, obbOperationId } = await req.json();

        let id = generateUniqueId();
        const timestamp = new Date()

        const LogedInOperator = await db.operatorSession.findMany({
            where: {
                operatorRfid,
                isLoggedIn: true
            }
        });
        
        if (LogedInOperator.length > 0) {
            const updatedSession = await db.operatorSession.updateMany({
                where: {
                    operatorRfid,
                    isLoggedIn: true
                },
                data: {
                    isLoggedIn: false,
                    LogoutTimestamp: timestamp.toISOString() as string,
                }
            });
            return NextResponse.json({ data: updatedSession, message: 'Session updated successfully'}, { status: 201 });

            // return new NextResponse("IF condition is working");
        } else { 
            const createdSession = await db.operatorSession.create({
                data: {
                    id,
                    operatorRfid,
                    LoginTimestamp: timestamp.toISOString() as string,
                    isLoggedIn: true,
                    obbOperationId
                }
            });
            return NextResponse.json({ data: createdSession, message: 'Session created successfully'}, { status: 201 });

            // return new NextResponse("ELSE condition is working");
        }

    } catch (error) {
        console.error("[SESSION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}