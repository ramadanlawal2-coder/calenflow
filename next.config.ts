import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow phones and other devices on the local network to load dev assets.
  // Entries are hostnames only — no scheme, port, or path.
  allowedDevOrigins: [
    "10.180.32.228",
    "192.168.0.157",
    "192.168.100.118",
    "192.168.100.95",
    "almiskeenthanyp",
  ],
};

export default nextConfig;
