import type { Metadata } from "next";
import Link from "next/link";

import { LegalDraftBanner } from "@/components/legal/legal-draft-banner";
import { TERMS_VERSION } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Termos de Uso",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <p>
        <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
          Voltar
        </Link>
      </p>
      <h1 className="text-3xl font-semibold">Termos de Uso</h1>
      <p className="text-sm text-muted-foreground">Versão {TERMS_VERSION}</p>
      <LegalDraftBanner />
      <div className="space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          Este documento descreve, de forma provisória, as regras de uso do painel VejaQui Ofertas
          por lojistas. O texto abaixo é um placeholder estrutural e precisa de revisão jurídica
          antes de qualquer uso em produção.
        </p>
        <p>
          Ao criar uma conta, a pessoa usuária aceita estes Termos e declara estar ciente da
          Política de Privacidade vigente na mesma data.
        </p>
        <p>
          O VejaQui Ofertas é uma plataforma de divulgação de promoções. A compra acontece fora da
          plataforma, no canal informado pelo lojista.
        </p>
      </div>
    </main>
  );
}
