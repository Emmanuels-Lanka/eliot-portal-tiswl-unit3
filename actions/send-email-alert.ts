import { Resend } from 'resend';
import { Operator, SewingMachine, Staff } from '@prisma/client';

import EmailTemplate from '@/components/dashboard/templates/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailAlertProps {
    to: string[];
    recipient: Staff;
    machine: SewingMachine;
    operator: Operator;
    alertType: string;
    unit: string;
    line: string;
};

type SendEmailAlertResponseProps = {
    status: number;
    message: string;
}

const sendEmailAlert = async ({
    to,
    recipient,
    machine,
    operator,
    alertType,
    unit,
    line
}: SendEmailAlertProps): Promise<SendEmailAlertResponseProps> => {
    try {
        const data = await resend.emails.send({
            from: 'ELIoT Global <notifications@eliot.global>',
            to: to,
            subject: `⚠️ ELIoT Alert Notification for ${alertType}`,
            react: EmailTemplate({ 
                recipientName: recipient.name,
                machine: {
                    machineType: machine.machineType,
                    brandName: machine.brandName,
                    machineId: machine.machineId,
                    serialNumber: machine.serialNumber,
                },
                unit,
                line,
                operatorName: operator.name,
                alertType: alertType,
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