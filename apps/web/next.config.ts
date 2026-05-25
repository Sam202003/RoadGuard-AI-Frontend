import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@roadguard/types', '@roadguard/config'],
};

export default nextConfig;
