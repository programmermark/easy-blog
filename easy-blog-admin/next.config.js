/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/blog-admin",
  assetPrefix: "/blog-admin",
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
