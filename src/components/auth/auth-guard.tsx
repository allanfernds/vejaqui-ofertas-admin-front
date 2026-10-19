"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { PageSkeleton } from "@/components/feedback/page-skeleton";
import { useAuth } from "@/providers/auth-provider";
import { useSelectedCompany } from "@/providers/company-provider";

interface AuthGuardProps {
  children: React.ReactNode;
  requireCompany?: boolean;
  redirectIfHasCompany?: boolean;
}

export function AuthGuard({
  children,
  requireCompany = false,
  redirectIfHasCompany = false,
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status } = useAuth();
  const { company, isLoading } = useSelectedCompany();

  useEffect(() => {
    if (status === "loading" || isLoading) {
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/entrar");
      return;
    }

    if (requireCompany && !company) {
      router.replace("/onboarding/empresa");
      return;
    }

    if (redirectIfHasCompany && company && pathname.startsWith("/onboarding")) {
      router.replace("/dashboard");
    }
  }, [company, isLoading, pathname, redirectIfHasCompany, requireCompany, router, status]);

  if (status === "loading" || isLoading) {
    return <PageSkeleton />;
  }

  if (status === "unauthenticated") {
    return <PageSkeleton />;
  }

  if (requireCompany && !company) {
    return <PageSkeleton />;
  }

  if (redirectIfHasCompany && company) {
    return <PageSkeleton />;
  }

  return <>{children}</>;
}
