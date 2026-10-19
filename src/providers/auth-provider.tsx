"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ApiError } from "@/types/api";
import { authService, readLocalSession } from "@/services/auth.service";
import type { AuthSession, AuthUser, SignInInput, SignUpInput } from "@/types/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  signIn: (input: SignInInput) => Promise<AuthSession>;
  signUp: (input: SignUpInput) => Promise<AuthSession>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const localSession = readLocalSession();
      if (!localSession) {
        if (!cancelled) {
          setStatus("unauthenticated");
          setUser(null);
        }
        return;
      }

      try {
        const session = await authService.getSession();
        if (cancelled) {
          return;
        }

        if (!session) {
          setStatus("unauthenticated");
          setUser(null);
          return;
        }

        setUser(session.user);
        setStatus("authenticated");
      } catch (error) {
        await authService.signOut();
        if (!cancelled) {
          setUser(null);
          setStatus("unauthenticated");
        }

        if (!(error instanceof ApiError && error.status === 401)) {
          console.error(error);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    const session = await authService.signIn(input);
    setUser(session.user);
    setStatus("authenticated");
    return session;
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const session = await authService.signUp(input);
    setUser(session.user);
    setStatus("authenticated");
    return session;
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ status, user, signIn, signUp, signOut }),
    [signIn, signOut, signUp, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
