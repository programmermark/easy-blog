/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    config.resolve.alias["@/"] = path.resolve(__dirname, "src/");
    return config;
  },
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@": "./src",
      "@/": "./src/",
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
