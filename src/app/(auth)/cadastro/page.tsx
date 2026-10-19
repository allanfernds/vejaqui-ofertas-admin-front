import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { GuestGuard } from "@/components/auth/guest-guard";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function SignUpPage() {
  return (
    <GuestGuard>
      <AuthShell
        title="Criar conta"
        description="Leva poucos minutos. Depois você cadastra sua empresa e publica a primeira oferta."
      >
        <SignUpForm />
      </AuthShell>
    </GuestGuard>
  );
}
