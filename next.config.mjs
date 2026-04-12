/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['hondabatamresmi.com', 'localhost:4000', 'localhost:3000'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hondabatamresmi.com',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'hondabatamresmi.com',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: '103.23.198.184',
                port: '3000',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3000',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
