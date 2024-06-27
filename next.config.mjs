/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // domains: [
        //     "ik.imagekit.io"
        // ]
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                // port: "443",
                // pathname: "/",
            },
        ]
    }
};

export default nextConfig;