import axios from "axios";

interface SendSmsAlertProps {
    message: string;
    recipient: string;
    scheduledDate?: string;     // y-m-d H:i:s | eg. 2024-04-19 12:50:06
}

type SendSmsAlertResponseProps = {
    status: number;
    message: string;
}

export const sendSmsAlert = async ({
    message,
    recipient,
    scheduledDate
}: SendSmsAlertProps): Promise<SendSmsAlertResponseProps> => {
    const apiKey = process.env.SMS_API_KEY;
    const apiEndpoint = process.env.SMS_ENDPOINT;

    // const recipients = phoneNumbers.join(',');

    const data = {
        api_key: apiKey,
        msg: message,
        to: recipient,
        ...(scheduledDate && { schedule: scheduledDate }), // Include schedule only if provided
    };

    try {
        const response = await axios.post(apiEndpoint as string, data);
        const jsonResponse = response.data;

        if (jsonResponse.error === 0) {
            console.log('SMS_SUCCESS_RESPONSE:', jsonResponse);
            return {
                status: 200,
                message: 'SMS sent successfully: ' + jsonResponse
            }
        } else {
            console.error('SMS_ERROR_RESPONSE:', jsonResponse);
            return {
                status: 409,
                message: 'Failed to send SMS: ' + jsonResponse
            }
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('AXIOS_ERROR:', error);
            return {
                status: 502,
                message: 'Axios error to send SMS: ' + error
            }
        } else {
            console.error('INTERNAL_ERROR:', error);
            return {
                status: 500,
                message: 'Internal Error!'
            }
        }
    }
}

export const checkSmsBalance = async() => {
    const apiKey = process.env.SMS_API_KEY;

    try {
        const response = await axios.post(`https://api.sms.net.bd/user/balance/?api_key=${apiKey}`);
        const jsonResponse = response.data;

        console.error('BALANCE:', jsonResponse.balance);
        return jsonResponse;
    } catch (error) {
        console.error('INTERNAL_ERROR:', error);
        return null;
    }
}