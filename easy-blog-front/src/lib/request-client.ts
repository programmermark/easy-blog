import { env } from "@/env";

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

const BASE_URL = normalizeBaseUrl(env.NEXT_PUBLIC_API_URL);

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
