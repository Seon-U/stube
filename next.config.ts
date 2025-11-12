import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = {
  images: {
    domains: ["avatar.vercel.sh", "i.ytimg.com"],
  },
};

export default nextConfig;
