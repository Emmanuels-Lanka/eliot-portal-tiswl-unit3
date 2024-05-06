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
    }
};

export default nextConfig;