"use server"

import { ObbSheet } from "@prisma/client";

import { db } from "@/lib/db";

export async function fetchObbSheetDetails(obbSheetId: string): Promise<ObbSheet | null> {
    try {
        const data = await db.obbSheet.findUnique({
            where: {
                id: obbSheetId
            }
        });

        // console.log("DATA:", data);
        return new Promise((resolve) => resolve(data as ObbSheet));
    } catch (error) {
        console.error("[FETCH_LINE_EFFICIENCY_RESOURCES_ERROR]", error);
        return null;
    }
}