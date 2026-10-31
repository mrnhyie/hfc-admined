import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: { root: projectRoot },
  async redirects() {
    return [{ source: '/gallery', destination: '/facebook', permanent: true }];
  },
};

export default nextConfig;
