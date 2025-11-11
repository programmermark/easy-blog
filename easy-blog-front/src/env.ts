export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "/blog-service",
  API_SECRET: process.env.API_SECRET || "",
  NEXT_PUBLIC_UPLOAD_URL:
    process.env.NEXT_PUBLIC_UPLOAD_URL || "/blog-service/upload",
};
