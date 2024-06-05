/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias.canvas = false;

        return config;
    },
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "**"
            },
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io'
            }
        ]
    },
    experimental: {
        taint: true
    }
};

export default nextConfig;
