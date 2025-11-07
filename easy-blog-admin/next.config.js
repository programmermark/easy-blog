/** @type {import('next').NextConfig} */
const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const nextConfig = {
  webpack: (config) => {
    const srcPath = path.resolve(__dirname, "src");
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": srcPath,
      "@/": `${srcPath}/`,
    };
    config.resolve.modules = [srcPath, ...(config.resolve.modules || [])];
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, "tsconfig.json") }),
    ];
    return config;
  },
};

module.exports = nextConfig;
