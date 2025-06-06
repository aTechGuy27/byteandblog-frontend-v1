import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
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
    NEXT_PUBLIC_API_URL: 'https://byteandblog.com',
  },
};

export default nextConfig;
