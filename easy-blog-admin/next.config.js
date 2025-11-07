/** @type {import('next').NextConfig} */
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    const srcPath = path.resolve(__dirname, "src");
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": srcPath,
      "@/": `${srcPath}/`,
    };
    return config;
  },
};

module.exports = nextConfig;
