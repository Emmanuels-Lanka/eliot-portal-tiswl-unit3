import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { obbSheetId: string } }
) {
    try {
        const existingSheet = await db.obbSheet.findUnique({
            where: {
                id: params.obbSheetId
            }
        });
        
        if (!existingSheet) {
            return new NextResponse("OBB sheet does not exist!", { status: 409 })
        }

        // Deactivate the OBB sheet
        await db.obbSheet.update({
            where: {
                id: params.obbSheetId
            },
            data: {
                isActive: false
            }
        });
        
        return new NextResponse("Deactivated the OBB Operation successfully", { status: 200 });
    } catch (error) {
        console.error("[OBB_SHEET_STATUS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}