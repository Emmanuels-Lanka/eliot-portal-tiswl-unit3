import { Resend } from 'resend';

import EmailTemplate from '@/components/dashboard/templates/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailAlertProps {
    to: string[];
    subject: string;
};

type SendEmailAlertResponseProps = {
    status: number;
    message: string;
}

const sendEmailAlert = async ({
    to,
    subject
}: SendEmailAlertProps): Promise<SendEmailAlertResponseProps> => {
    try {
        const data = await resend.emails.send({
            from: 'ELIoT <onboarding@resend.dev>',      // Your Company Name <onboarding@yourcompany.com>
            to: to,     // ['delivered@resend.dev']
            subject: subject,
            react: EmailTemplate({ name: 'Vinojan' }),
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