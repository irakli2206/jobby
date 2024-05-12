/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns:[{
            protocol: 'https',
            hostname: "**"
        }]
    }
};

export default nextConfig;
