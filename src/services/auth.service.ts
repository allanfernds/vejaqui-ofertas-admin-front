import { api } from "@/lib/api";
import {
  clearStoredSession,
  getStoredAccessToken,
  getStoredUser,
  persistSession,
} from "@/lib/auth-storage";
import type { ApiResponse } from "@/types/api";
import type {
  AuthPort,
  AuthSession,
  AuthUser,
  SignInInput,
  SignUpInput,
} from "@/types/auth";

interface AuthResult {
  user: AuthUser;
  token: string;
}

function storeSession(result: AuthResult): AuthSession {
  const session = { user: result.user, token: result.token };
  persistSession(session);
  return session;
}

export const jwtAuthAdapter: AuthPort = {
  async signUp(input: SignUpInput): Promise<AuthSession> {
    const response = await api.post<ApiResponse<AuthResult>>("/auth/register", input, {
      auth: false,
    });
    return storeSession(response.data);
  },

  async signIn(input: SignInInput): Promise<AuthSession> {
    const response = await api.post<ApiResponse<AuthResult>>("/auth/login", input, {
      auth: false,
    });
    return storeSession(response.data);
  },

  async signOut(): Promise<void> {
    clearStoredSession();
  },

  async getSession(): Promise<AuthSession | null> {
    const token = getStoredAccessToken();
    if (!token) {
      return null;
    }

    const response = await api.get<ApiResponse<AuthUser>>("/auth/me");
    const session = { user: response.data, token };
    persistSession(session);
    return session;
  },

  async getAccessToken(): Promise<string | null> {
    return getStoredAccessToken();
  },
};

export const authService = jwtAuthAdapter;

export function readLocalSession(): AuthSession | null {
  const token = getStoredAccessToken();
  const user = getStoredUser();
  if (!token || !user) {
    return null;
  }
  return { token, user };
}
