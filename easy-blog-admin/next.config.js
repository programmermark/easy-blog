/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
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
      "@": "./src",
      "@/": "./src/",
    },
  },
};

module.exports = nextConfig;
