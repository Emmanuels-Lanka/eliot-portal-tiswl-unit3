"use server"

import { DateRange } from "react-day-picker";
import { ObbOperation, ObbSheet, Operation, Operator, ProductionLine, RoamingQC, SewingMachine } from "@prisma/client";

import { db } from "@/lib/db";

type ReturnDataType = RoamingQC & {
    obbOperation: ObbOperation & {
        obbSheet: ObbSheet & {
            productionLine: ProductionLine;
        };
        operation: Operation
    };
    operator: Operator
}

export async function fetchRoamingQcData(obbSheetId: string, date: DateRange): Promise<ReturnDataType[]> {
    try {
        const startDate = `${date.from?.toISOString().split('T')[0]} 00:00:00`;
        const endDate = `${date.to?.toISOString().split('T')[0]} 23:59:59`;
        // console.log("DATE_RANGE:", startDate, "-" ,endDate);

        const data = await db.roamingQC.findMany({
            where: {
                obbOperation: {
                    obbSheetId
                },
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                obbOperation: {
                    select: {
                        part: true,
                        obbSheet: {
                            select: {
                                style: true,
                                productionLine: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        },
                        operation: {
                            select: {
                                name: true,
                                code: true
                            }
                        },
                    }
                },
                operator: {
                    select: {
                        name: true,
                        rfid: true
                    }
                }
            },
            orderBy: {
                createdAt: "asc",
                // machineId: "asc"
            }
        });

        // console.log("DATA:", data.length);
        return new Promise((resolve) => resolve(data as ReturnDataType[]));
    } catch (error) {
        console.error("[FETCH_LINE_EFFICIENCY_RESOURCES_ERROR]", error);
        return [];
    }
}