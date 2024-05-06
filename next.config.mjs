/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "ik.imagekit.io"
        ]
    },
    env: {
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        SMS_API_KEY: process.env.SMS_API_KEY,
        SMS_ENDPOINT: process.env.SMS_ENDPOINT,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        AUTHORIZED_IOT_KEY: process.env.AUTHORIZED_IOT_KEY
    }
};

export default nextConfig;