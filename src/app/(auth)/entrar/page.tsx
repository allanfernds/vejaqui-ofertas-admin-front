import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { GuestGuard } from "@/components/auth/guest-guard";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Entrar",
};

export default function SignInPage() {
  return (
    <GuestGuard>
      <AuthShell
        title="Entrar"
        description="Acesse sua conta para publicar e gerenciar suas ofertas."
      >
        <SignInForm />
      </AuthShell>
    </GuestGuard>
  );
}
