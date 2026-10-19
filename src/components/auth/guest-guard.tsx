"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { PageSkeleton } from "@/components/feedback/page-skeleton";
import { useAuth } from "@/providers/auth-provider";
import { useSelectedCompany } from "@/providers/company-provider";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();
  const { company, isLoading } = useSelectedCompany();

  useEffect(() => {
    if (status === "loading" || (status === "authenticated" && isLoading)) {
      return;
    }

    if (status === "authenticated") {
      router.replace(company ? "/dashboard" : "/onboarding/empresa");
    }
  }, [company, isLoading, router, status]);

  if (status === "loading" || status === "authenticated") {
    return <PageSkeleton />;
  }

  return <>{children}</>;
}
