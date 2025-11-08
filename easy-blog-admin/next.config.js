/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
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
};

module.exports = nextConfig;
