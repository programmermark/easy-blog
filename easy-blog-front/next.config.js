/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  basePath: "/blog",
  assetPrefix: "/blog",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
    ],
    unoptimized: false,
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
