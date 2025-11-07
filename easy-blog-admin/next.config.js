/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    disableFontDownloads: true,
  },
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@": "./src",
      "@/": "./src/",
    },
  },
};

module.exports = nextConfig;
