export const env = {
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/blog-service",
  NEXT_PUBLIC_UPLOAD_URL:
    process.env.NEXT_PUBLIC_UPLOAD_URL ||
    "http://localhost:8000/blog-service/upload",
};
