import type { AuthSession, AuthUser } from "@/types/auth";

const TOKEN_KEY = "vejaqui.auth.token";
const USER_KEY = "vejaqui.auth.user";

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function getStoredAccessToken(): string | null {
  if (!canUseSessionStorage()) {
    return null;
  }
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function persistSession(session: AuthSession): void {
  if (!canUseSessionStorage()) {
    return;
  }

  sessionStorage.setItem(TOKEN_KEY, session.token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function clearStoredSession(): void {
  if (!canUseSessionStorage()) {
    return;
  }

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
