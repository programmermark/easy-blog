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
      "@": path.resolve(__dirname, "src"),
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },
};

module.exports = nextConfig;
