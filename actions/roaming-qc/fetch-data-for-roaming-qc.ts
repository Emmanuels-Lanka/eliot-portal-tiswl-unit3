"use server"

import moment from 'moment-timezone';

import { db } from '@/lib/db';

export async function fetchDataForRoamingQC(obbSheetId: string, machineId: string): Promise<DataTypesForRoamingQC | null> {
    try {
        // console.log("Working 1");
        
        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
        const today = moment().tz(timezone).format('YYYY-MM-DD');
        const startDate = `${today} 00:00:00`;
        const endDate = `${today} 23:59:59`;

        const obbOperation = await db.obbOperation.findMany({
            where: {
                obbSheetId,
                sewingMachine: {
                    machineId
                }
            },
            select: {
                id: true,
                obbSheet: {
                    select: {
                        style: true,
                        buyer: true
                    }
                },
                operation: {
                    select: {
                        name: true,
                        code: true
                    }
                }
            }
        });

        if (obbOperation.length === 0) {
            return null;
        }
        // console.log("Working 2");

        const opSession = await db.operatorSession.findMany({
            where: {
                isLoggedIn: true,
                obbOperationId: obbOperation[0].id,
                LoginTimestamp: { 
                    gte: startDate, 
                    lte: endDate 
                }
            },
            select: {
                id: true,
                operator: {
                    select: {
                        name: true,
                        rfid: true
                    }
                }
            }
        });

        if (opSession.length === 0) {
            return null;
        }
        // console.log("Working 3");

        const formattedData = {
            style: obbOperation[0].obbSheet.style,
            buyerName: obbOperation[0].obbSheet.buyer,
            obbOperationId: obbOperation[0].id,
            operationName: obbOperation[0].operation.name,
            operationCode: obbOperation[0].operation.code,
            operatorName: opSession[0].operator.name,
            operatorRfid: opSession[0].operator.rfid,
        };

        // console.log("DATAA:", formattedData);

        return new Promise((resolve) => resolve(formattedData as DataTypesForRoamingQC));
    } catch (error) {
        console.error("[FETCH_GMT_DEFECTS_ERROR]", error);
        return null;
    }
}