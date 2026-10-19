"use client";

import { createContext, useContext, useMemo } from "react";

import { useCompanies } from "@/hooks/use-companies";
import { useAuth } from "@/providers/auth-provider";
import type { CompanyWithRole } from "@/types/company";

interface CompanyContextValue {
  company: CompanyWithRole | null;
  isLoading: boolean;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const companiesQuery = useCompanies(status === "authenticated");

  const value = useMemo(
    () => ({
      company: companiesQuery.data?.[0] ?? null,
      isLoading: status === "loading" || (status === "authenticated" && companiesQuery.isLoading),
    }),
    [companiesQuery.data, companiesQuery.isLoading, status],
  );

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useSelectedCompany(): CompanyContextValue {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useSelectedCompany must be used within CompanyProvider");
  }
  return context;
}
