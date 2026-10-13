import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity serves every asset from this host. Required for next/image.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" },
    ],
  },
};

export default nextConfig;
