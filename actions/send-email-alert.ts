import { Resend } from 'resend';
import { Operator, SewingMachine, Staff } from '@prisma/client';

import EmailTemplate from '@/components/dashboard/templates/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailAlertProps {
    to: string[];
    recipient: Staff;
    machine: SewingMachine;
    operator: Operator;
};

type SendEmailAlertResponseProps = {
    status: number;
    message: string;
}

const sendEmailAlert = async ({
    to,
    recipient,
    machine,
    operator
}: SendEmailAlertProps): Promise<SendEmailAlertResponseProps> => {
    try {
        const data = await resend.emails.send({
            from: 'ELIoT Global <notifications@eliot.global>',
            to: to,
            subject: "ELIoT Alert Notification ⚠️",
            react: EmailTemplate({ 
                recipient: {
                    name: recipient.name,
                    // phone: recipient.phone,
                    // email: recipient.email,
                    // employeeId: recipient.employeeId,
                    // rfid: recipient.rfid,
                    // designation: recipient.designation,
                },
                machine: {
                    machineType: machine.machineType,
                    brandName: machine.brandName,
                    machineId: machine.machineId,
                    serialNumber: machine.serialNumber,
                },
                operatorName: operator.name
            }),
        });

        console.log('Email sent successfully:', data);
        return {
            status: 200,
            message: 'Email sent successfully: ' + data
        }
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            status: 500,
            message: 'Internal Error!' + error
        }
    }
}

export default sendEmailAlert;