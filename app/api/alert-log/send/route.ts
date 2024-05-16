import { NextResponse } from "next/server";
import moment from "moment-timezone";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";
import { sendSmsAlert } from "@/actions/send-sms-alert";
import sendEmailAlert from "@/actions/send-email-alert";

export async function POST(
    req: Request,
) {
    try {
        const { verifiedKey, machineId, operatorRfid, employeeId, alertType } = await req.json();

        let id = generateUniqueId();
        
        const date = new Date;
        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
        const timestamp = moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');

        const authorizedKey = process.env.AUTHORIZED_IOT_KEY;

        if (authorizedKey !== verifiedKey) {
            return new NextResponse("Unauthorized!", { status: 401 })
        }

        // Fetch employee data
        const recipient = await db.staff.findUnique({
            where: {
                employeeId
            }
        });

        // Fetch machine data
        const machine = await db.sewingMachine.findUnique({
            where: {
                machineId
            },
            include: {
                unit: {
                    select: {
                        name: true
                    }
                },
                productionLines: {
                    select: {
                        name: true
                    }
                }
            }
        });

        const operator = await db.operator.findUnique({
            where: {
                rfid: operatorRfid
            }
        });

        if (recipient && machine && operator) {
            let recipientEmail: string[] = [];
            recipientEmail.push(recipient?.email);

            const message: string = `-ELIoT Global SMS Alert-
    REQ: ${alertType},
    Unit: ${machine.unit.name},
    Line: ${machine.productionLines[0].name},
    Machine ID: ${machineId},
    Time: ${timestamp}`

            const smsResponse = await sendSmsAlert({
                message,
                recipient: recipient?.phone
            });

            const emailResponse = await sendEmailAlert({
                to: recipientEmail,
                recipient,
                machine,
                operator,
                alertType,
                unit: machine.unit.name,
                line: machine.productionLines[0].name
            });

            if (smsResponse.status === 200 && emailResponse.status === 200) {
                try {
                    const alertLog = await db.alertLog.create({
                        data: {
                            id,
                            machineId,
                            operatorRfid,
                            employeeId,
                            alertType,
                            smsStatus: 'SENT',
                            emailStatus: 'SENT',
                            reqTimestamp: timestamp,
                        }
                    });
                    return NextResponse.json({ data: alertLog, message: 'SMS & Email alert sent successfully' }, { status: 201 });
                } catch (error) {
                    console.log("ERROR:", error);
                    return new NextResponse("Error to store the data in DB", { status: 409 });
                }
            }
            else if (smsResponse.status === 409) {
                return new NextResponse("SMS service unavailable!", { status: 503 });
            }
            else if (smsResponse.status === 502 || smsResponse.status === 500 || emailResponse.status === 500) {
                return new NextResponse("Internal Service error!", { status: 500 });
            }
        } else {
            return new NextResponse("Bad request! Please send the correct request body.", { status: 400 });
        }

    } catch (error) {
        console.error("[SEND_ALERT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request
) {
    const { verifiedKey, machineId, employeeId, reqType } = await req.json();

    try {
        const authorizedKey = process.env.AUTHORIZED_IOT_KEY;

        if (authorizedKey !== verifiedKey) {
            return new NextResponse("Unauthorized!", { status: 401 })
        }
        
        const date = new Date;
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka';
        const timestamp = moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
        
        const startDate = `${formattedDate} 00:00:00`;
        const endDate = `${formattedDate} 23:59:59`;

        if (reqType === 'login') {
            const updatedAlertLog = await db.alertLog.updateMany({
                where: {
                    machineId,
                    employeeId,
                    reqTimestamp: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                data: {
                    loginTimestamp: timestamp
                }
            });
            
            return NextResponse.json({ data: updatedAlertLog, message: 'Employee login successfully' }, { status: 201 });
        } else if (reqType === 'logout') {
            const updatedAlertLog = await db.alertLog.updateMany({
                where: {
                    machineId,
                    employeeId,
                    reqTimestamp: {
                        gte: startDate,
                        lte: endDate
                    }
                },
                data: {
                    logoutTimestamp: timestamp
                }
            });
            return NextResponse.json({ data: updatedAlertLog, message: 'Employee logout successfully' }, { status: 201 });
        }
        return new NextResponse("Request type is undefined", { status: 502 });
    } catch (error) {
        console.error("[UPDATE_ALERT_LOG_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}