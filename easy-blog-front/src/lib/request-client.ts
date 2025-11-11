import { env } from "@/env";

const resolveBaseUrl = () => {
  const base = env.NEXT_PUBLIC_API_URL;
  if (
    typeof window !== "undefined" &&
    (base.startsWith("http://localhost") ||
      base.startsWith("https://localhost") ||
      base.startsWith("http://127.0.0.1") ||
      base.startsWith("https://127.0.0.1"))
  ) {
    return "/api";
  }
  return base;
};

const BASE_URL = resolveBaseUrl();

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${input}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include", // 若用 cookie 鉴权
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const requestClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(url: string, body?: unknown) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  del: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
