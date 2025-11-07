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
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@": path.resolve(__dirname, "src"),
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },
};

module.exports = nextConfig;
