/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  webpack: (config) => {
    const srcPath = path.resolve(__dirname, "src");
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": srcPath,
      "@/": `${srcPath}/`,
    };
    config.resolve.modules = [srcPath, ...(config.resolve.modules || [])];
    return config;
  },
};

module.exports = nextConfig;
