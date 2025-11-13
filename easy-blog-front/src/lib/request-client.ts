import { env } from "@/env";

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

const getAccessTokenFromCookie = () => {
  if (typeof document === "undefined") return undefined;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  const tokenPair = cookies.find((cookie) => cookie.startsWith("accessToken="));
  if (!tokenPair) return undefined;
  const [, value] = tokenPair.split("=");
  return value ? decodeURIComponent(value) : undefined;
};

const BASE_URL = normalizeBaseUrl(env.NEXT_PUBLIC_API_URL);

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Authorization")) {
    const token = getAccessTokenFromCookie();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(`${BASE_URL}${input}`, {
    ...init,
    headers,
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
