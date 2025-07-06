/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['hondabatamresmi.com', 'localhost:4000'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hondabatamresmi.com',
                port: '',
                pathname: '/uploads/**',
                search: '',
            },
            {
                protocol: 'http',
                hostname: 'hondabatamresmi.com',
                pathname: '/uploads/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '4000',
                pathname: '/uploads/**',
            },
        ],
    },
};

export default nextConfig;
