import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";
import { sendSmsAlert } from "@/actions/send-sms-alert";
import sendEmailAlert from "@/actions/send-email-alert";

export async function POST(
    req: Request,
) {
    try {
        const { verifiedKey, machineId, operatorRfid, employeeId, alertType, message } = await req.json();

        let id = generateUniqueId();
        const timestamp = new Date();
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
            }
        });

        const operator = await db.operator.findUnique({
            where: {
                rfid: operatorRfid
            }
        })
        
        if (recipient && machine && operator) {
            let recipientEmail:string[] = [];
            recipientEmail.push(recipient?.email);

            const smsResponse = await sendSmsAlert({
                message,
                recipient: recipient?.phone
            });

            const emailResponse = await sendEmailAlert({
                to: recipientEmail,
                recipient,
                machine,
                operator
            });
            
            if (smsResponse.status === 200 && emailResponse.status === 200) {
                // TODO: Store the alert information to the database
                return new NextResponse("Successfully send SMS alert!", { status: 200 });
            }
            else if (smsResponse.status === 409) {
                return new NextResponse("SMS service unavailable!", { status: 503 });
            } 
            else if (smsResponse.status === 502 || smsResponse.status === 500 || emailResponse.status === 500) {
                return new NextResponse("Internal Service error!", { status: 500 });
            }
        }
        // return NextResponse.json({ data: createdSession, message: 'Session created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[SEND_ALERT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}