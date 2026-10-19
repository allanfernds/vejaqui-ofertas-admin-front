"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthGuard } from "@/components/auth/auth-guard";
import { CompanyForm } from "@/components/company/company-form";
import { getErrorMessage } from "@/lib/api-error";
import { useCreateCompany } from "@/hooks/use-companies";
import { toCreateCompanyPayload, type CompanyFormValues } from "@/schemas/company.schema";

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const createCompany = useCreateCompany();

  async function handleSubmit(values: CompanyFormValues) {
    try {
      await createCompany.mutateAsync(toCreateCompanyPayload(values));
      toast.success("Empresa cadastrada com sucesso.");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error, "Não conseguimos cadastrar sua empresa. Tente novamente."));
    }
  }

  return (
    <AuthGuard redirectIfHasCompany>
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div>
            <p className="text-sm font-medium text-primary">VejaQui Ofertas</p>
            <h1 className="mt-2 text-3xl font-semibold">Cadastre sua empresa</h1>
            <p className="mt-2 text-muted-foreground">
              Precisamos desses dados para mostrar suas ofertas para pessoas da sua região.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <CompanyForm
              mode="create"
              onSubmit={handleSubmit}
              submitLabel="Concluir cadastro"
              submittingLabel="Salvando..."
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
