"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/auth-provider";
import { CompanyProvider } from "@/providers/company-provider";
import { QueryProvider } from "@/providers/query-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
      <QueryProvider>
        <AuthProvider>
          <CompanyProvider>
            <TooltipProvider>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </TooltipProvider>
          </CompanyProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
