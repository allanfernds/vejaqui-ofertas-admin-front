import type { Metadata } from "next";
import Link from "next/link";

import { LegalDraftBanner } from "@/components/legal/legal-draft-banner";
import { PRIVACY_POLICY_VERSION } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <p>
        <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
          Voltar
        </Link>
      </p>
      <h1 className="text-3xl font-semibold">Política de Privacidade</h1>
      <p className="text-sm text-muted-foreground">Versão {PRIVACY_POLICY_VERSION}</p>
      <LegalDraftBanner />
      <div className="space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          Este documento é um rascunho estrutural da Política de Privacidade do VejaQui Ofertas.
          Ele ainda não está aprovado para produção e deve ser revisado sob a LGPD.
        </p>
        <p>
          Pretendemos tratar dados cadastrais da conta, dados da empresa e conteúdo das ofertas
          para operar o painel e divulgar promoções na região informada.
        </p>
        <p>
          A data e hora do aceite são registradas pelo servidor no momento do cadastro. O
          frontend envia apenas a versão dos documentos aceitos.
        </p>
      </div>
    </main>
  );
}
