import { env } from "@/lib/env";
import { clearStoredSession, getStoredAccessToken } from "@/lib/auth-storage";
import { ApiError, type ApiErrorBody } from "@/types/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = env.apiUrl || "http://localhost:3333/api/v1";
  const url = new URL(path.startsWith("http") ? path : `${base}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!value || typeof value !== "object" || !("error" in value)) {
    return false;
  }

  const error = (value as ApiErrorBody).error;
  return Boolean(error && typeof error.code === "string" && typeof error.message === "string");
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers({
    Accept: "application/json",
  });

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = getStoredAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const payload = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401 && options.auth !== false) {
      clearStoredSession();
    }

    if (isApiErrorBody(payload)) {
      throw new ApiError(payload.error.message, {
        status: response.status,
        code: payload.error.code,
        details: payload.error.details,
      });
    }

    throw new ApiError("Não foi possível concluir esta ação. Tente novamente.", {
      status: response.status,
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  return payload as T;
}

export const api = {
  get<T>(path: string, query?: RequestOptions["query"]): Promise<T> {
    return request<T>(path, { method: "GET", query });
  },
  post<T>(path: string, body?: unknown, options?: Pick<RequestOptions, "auth">): Promise<T> {
    return request<T>(path, { method: "POST", body, auth: options?.auth });
  },
  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, { method: "PATCH", body });
  },
};
