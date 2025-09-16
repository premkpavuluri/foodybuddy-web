import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable more verbose logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Enable experimental logging features
  experimental: {
    logging: {
      level: 'verbose',
      fullUrl: true,
    },
  },
};

export default nextConfig;
