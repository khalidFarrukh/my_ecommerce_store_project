/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'next.medusajs.com',
                pathname: '/_next/image',
            },
            {
                protocol: 'https',
                hostname: 'medusa-server-testing.s3.us-east-1.amazonaws.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
