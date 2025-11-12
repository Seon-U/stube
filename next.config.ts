import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = {
  images: {
    domains: ["avatar.vercel.sh", "i.ytimg.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;
