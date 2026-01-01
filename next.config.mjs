/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/ingest/static/:path*",
                destination: "https://us-assets.i.posthog.com/static/:path*",
            },
            {
                source: "/ingest/:path*",
                destination: "https://us.i.posthog.com/:path*",
            },
            {
                source: "/decide",
                destination: "https://us.i.posthog.com/decide",
            },
        ];
    },
    // This is required to support PostHog's toolbar
    skipTrailingSlashRedirect: true,
};

export default nextConfig;
