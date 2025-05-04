import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Fix the assetPrefix to start with a leading slash
  env: {
    NEXT_PUBLIC_API_URL: 'https://byteandblog.com/api',
  },
};

export default nextConfig;
