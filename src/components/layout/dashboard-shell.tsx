"use client";

import { Home, Menu, Store, Tag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useSelectedCompany } from "@/providers/company-provider";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/ofertas", label: "Ofertas", icon: Tag },
  { href: "/empresa", label: "Minha empresa", icon: Store },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { company } = useSelectedCompany();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <aside className="hidden w-64 shrink-0 border-r bg-card/70 px-4 py-6 md:block">
          <Link href="/dashboard" className="mb-8 block px-2 text-lg font-semibold">
            VejaQui Ofertas
          </Link>
          <nav className="space-y-1" aria-label="Navegação principal">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b bg-card/80 px-4 py-3 md:px-8">
            <div className="flex items-center gap-2 md:hidden">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Abrir menu"
                onClick={() => setMobileOpen((open) => !open)}
              >
                <Menu className="size-4" />
              </Button>
              <span className="font-semibold">VejaQui</span>
            </div>
            <p className="hidden text-sm text-muted-foreground md:block">
              {company?.name ?? "Sua loja"}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-9 max-w-48 items-center justify-center truncate rounded-lg border border-border bg-background px-3 text-sm font-medium">
                {user?.name ?? "Conta"}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => void signOut()}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {mobileOpen ? (
            <nav className="grid gap-1 border-b bg-card px-4 py-3 md:hidden" aria-label="Menu móvel">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}

          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
