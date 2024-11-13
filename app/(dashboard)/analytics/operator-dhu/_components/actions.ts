"use server";
import { neon } from "@neondatabase/serverless";
import { ReportData1 } from "./dhu-report";

export async function getDHUData(obbsheetid: string, date: string): Promise<any[]> {
    const sql = neon(process.env.RFID_DATABASE_URL || "");

    console.log("dateeee",date)

    const dataGmts = await sql`
        SELECT count(*) as count, "qcStatus" qc, "operatorName" as name, "operatorId" as operatorid 
        FROM "GmtDefect"
        WHERE "qcStatus" <> 'pass' AND "obbSheetId" = ${obbsheetid} AND timestamp LIKE ${date}
        GROUP BY "operatorName", "qcStatus", "operatorId";
    `;
    // console.log("data fetched1", dataGmts);

    const dataProducts = await sql`
        SELECT count(*) as count, "qcStatus" qc, "operatorName" as name 
        FROM "ProductDefect"
        WHERE "qcStatus" <> 'pass' AND "obbSheetId" = ${obbsheetid} AND timestamp LIKE ${date}
        GROUP BY "operatorName", "qcStatus";
    `;
    // console.log("data fetched2", dataProducts);

    const tc = await sql`
        SELECT count(*) as count FROM "GmtDefect"
        WHERE "obbSheetId" = ${obbsheetid} AND timestamp LIKE ${date}
    `;

    const tcProducts = await sql`
        SELECT count(*) as count FROM "ProductDefect"
        WHERE "obbSheetId" = ${obbsheetid} AND timestamp LIKE ${date}
    `;

    const count: number = Number(tc?.[0]?.count) || 1;
    const countP: number = Number(tcProducts?.[0]?.count) || 1;

    const updatedGmtDfcts: any[] = [];

    for (const gmtdfct of dataGmts) {
        const tmpIndex = dataProducts.findIndex(p => p.name === gmtdfct.name);

        if (tmpIndex !== -1) {
            const tmp = dataProducts[tmpIndex];
            updatedGmtDfcts.push({ ...gmtdfct, count: tmp.count + gmtdfct.count });
            dataProducts.splice(tmpIndex, 1);
        } else {
            updatedGmtDfcts.push(gmtdfct);
        }
    }

    for (const prdDfct of dataProducts) {
        updatedGmtDfcts.push(prdDfct);
    }

    const res = updatedGmtDfcts.map(d => ({
        ...d, count: (d.count / (count + countP)) * 100
    }));

    return res;
}

export async function getDailyData(obbsheetid: string, date: string): Promise<ReportData1[]> {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`
        SELECT opr.id, opr.name as operatorname,
               opr.id as operatorid,
               op.name as operationname,
               obbop.target,
               unt.name as unitname,
               obbs.style as style,
               sm."machineId" as machineid,
               pl.name as linename,
               COUNT(pd."operatorRfid") as inspect,
               obbop."seqNo",
               opr."employeeId"
        FROM "ProductionData" pd
        INNER JOIN "Operator" opr ON pd."operatorRfid" = opr.rfid 
        INNER JOIN "ObbOperation" obbop ON pd."obbOperationId" = obbop.id
        INNER JOIN "ObbSheet" obbs ON obbop."obbSheetId" = obbs.id
        INNER JOIN "Operation" op ON obbop."operationId" = op.id
        INNER JOIN "Unit" unt ON obbs."unitId" = unt.id
        INNER JOIN "SewingMachine" sm ON obbop."sewingMachineId" = sm.id
        INNER JOIN "ProductionLine" pl ON pl.id = obbs."productionLineId"
        WHERE pd."timestamp" LIKE ${date} AND obbs.id = ${obbsheetid}
        GROUP BY opr.id, opr.name, op.name, obbop.smv, obbop.target, unt.name, obbs.style, sm.id, pl.name, obbs.buyer, obbop."seqNo",opr."employeeId"
        ORDER BY obbop."seqNo" ASC;
    `;

    return data as ReportData1[];
}

export async function getDefects(obbsheetid: string, date: string): Promise<any[]> {
    const sql = neon(process.env.RFID_DATABASE_URL || "");

    const newdate = `${date}%`;
    console.log("obbsheet id and date", obbsheetid, newdate);

    const data = await sql`
        SELECT 
            COUNT(pd.id) as defectcount,
            pd."operatorId" as operatorid
        FROM "ProductDefect" pd
        LEFT JOIN "_ProductQC" pqc ON pqc."B" = pd.id
        LEFT JOIN "Defect" d ON d.id = pqc."A"
        WHERE pd."qcStatus" <> 'pass' 
            AND pd."obbSheetId" = ${obbsheetid}
            AND pd.timestamp LIKE ${newdate}
        GROUP BY d.name, pd."operatorId"

        UNION

        SELECT 
            COUNT(gd.id) as defectcount,
            gd."operatorId" as operatorid
        FROM "GmtDefect" gd
        LEFT JOIN "_GmtQC" gqc ON gqc."B" = gd.id
        LEFT JOIN "Defect" d ON d.id = gqc."A"
        WHERE gd."qcStatus" <> 'pass' 
            AND gd."obbSheetId" = ${obbsheetid}
            AND gd.timestamp LIKE ${newdate}
        GROUP BY d.name, gd."operatorId"
    `;

    return data as any[];
}


export async function inspaetfetch(obbsheetid: string, date: string): Promise<any[]> {
    const sql = neon(process.env.RFID_DATABASE_URL || "");

    const newdate = `${date}%`;
    console.log("obbsheet id and date", obbsheetid, newdate);

    const data = await sql`
        SELECT 
          count(*) as inspectcount
          from
          "ProductDefect"
          where timestamp like ${date} and "obbSheetId"=${obbsheetid} 

        UNION

      SELECT 
          count(*) as inspectcount
          from
          "GmtDefect"
          where timestamp like ${date} and "obbSheetId"=${obbsheetid} 

    `;

    // console.log("inspect count000000000000000000000000000000000",data)

    return data as any[];
}


