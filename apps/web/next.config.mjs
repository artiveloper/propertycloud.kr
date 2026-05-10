/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@workspace/ui"],
    async rewrites() {
        return [
            {
                source: "/api/v1/:path*",
                destination: `${process.env.API_BASE_URL}/api/v1/:path*`,
            },
        ]
    },
}

export default nextConfig
