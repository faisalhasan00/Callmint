import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow accessing the dev server from local network devices (e.g. your phone)
  allowedDevOrigins: ['192.168.1.14'],
};

export default nextConfig;
