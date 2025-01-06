"use server"

import { ObbSheet } from "@prisma/client";

import { db } from "@/lib/db";

export async function fetchObbSheetsForUnit(unitName: string): Promise<ObbSheet[]> {
    try {
        const obbSheets = await db.obbSheet.findMany({
            where: {
                unit: {
                    name: unitName
                },
                isActive: true
            }
        });

        return new Promise((resolve) => resolve(obbSheets as ObbSheet[]));
    } catch (error) {
        console.error("[FETCH_OBB_SHEETS_FOR_UNIT_ERROR]", error);
        return [];
    }
}