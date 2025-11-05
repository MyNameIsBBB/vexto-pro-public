/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Remove standalone for Vercel deployment
    // output: "standalone", // Only needed for Docker
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
