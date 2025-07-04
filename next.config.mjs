/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['hondabatamresmi.com'],
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
        ],
    },
};

export default nextConfig;
