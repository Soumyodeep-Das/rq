import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows accessing the dev server from other devices on the LAN (e.g. mobile testing)
  allowedDevOrigins: ["localhost:3000", "192.168.1.7:3000"]
};

export default nextConfig;
