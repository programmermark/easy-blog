/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  basePath: isProd ? "/admin" : "",
  assetPrefix: isProd ? "/admin" : undefined,
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
