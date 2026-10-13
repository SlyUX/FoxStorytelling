import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // React <ViewTransition> integration: pages rise over and lower away from
    // each other. See src/components/route-transition.tsx.
    viewTransition: true,
  },
  images: {
    // Sanity serves every asset from this host. Required for next/image.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
