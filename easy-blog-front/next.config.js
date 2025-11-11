/** @type {import('next').NextConfig} */
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
    ],
  },
};

module.exports = nextConfig;
