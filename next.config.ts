import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/morbius",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/morbius",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
