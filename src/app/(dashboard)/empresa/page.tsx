"use client";

import { useState } from "react";
import { toast } from "sonner";

import { CompanyForm } from "@/components/company/company-form";
import { CompanyLogoDialog } from "@/components/company/company-logo-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api-error";
import { formatPhone, formatPostalCode } from "@/lib/masks";
import { useUpdateCompany } from "@/hooks/use-companies";
import { useSelectedCompany } from "@/providers/company-provider";
import { toCreateCompanyPayload, type CompanyFormValues } from "@/schemas/company.schema";
import { formatCnpj, formatCpf, maskDocument } from "@/utils/cpf-cnpj";

export default function CompanyPage() {
  const { company, isLoading } = useSelectedCompany();
  const [isEditing, setIsEditing] = useState(false);
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState(false);
  const updateCompany = useUpdateCompany(company?.id ?? "");

  if (isLoading || !company) {
    return <Skeleton className="h-80 w-full" />;
  }

  async function handleSubmit(values: CompanyFormValues) {
    const payload = toCreateCompanyPayload(values);
    try {
      await updateCompany.mutateAsync({
        name: payload.name,
        legalName: payload.legalName,
        businessEmail: payload.businessEmail,
        phone: payload.phone,
        whatsapp: payload.whatsapp,
        postalCode: payload.postalCode,
        street: payload.street,
        number: payload.number,
        complement: payload.complement,
        neighborhood: payload.neighborhood,
        city: payload.city,
        state: payload.state,
      });
      toast.success("Dados da empresa atualizados.");
      setIsEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Não conseguimos salvar sua empresa. Tente novamente."));
    }
  }

  const initial = company.name.trim().charAt(0).toUpperCase() || "E";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Minha empresa</h1>
        <p className="mt-2 text-muted-foreground">Essas informações aparecem junto das suas ofertas.</p>
      </div>

      {isEditing ? (
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <CompanyForm
            mode="edit"
            defaultValues={{
              personType: company.personType,
              document:
                company.personType === "PF"
                  ? formatCpf(company.document)
                  : formatCnpj(company.document),
              name: company.name,
              legalName: company.legalName ?? "",
              businessEmail: company.businessEmail,
              phone: formatPhone(company.phone),
              whatsapp: company.whatsapp ? formatPhone(company.whatsapp) : "",
              postalCode: formatPostalCode(company.postalCode),
              street: company.street,
              number: company.number,
              complement: company.complement ?? "",
              neighborhood: company.neighborhood,
              city: company.city,
              state: company.state,
              logoUrl: company.logoUrl ?? "",
              logoPublicId: company.logoPublicId ?? "",
            }}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
            submitLabel="Salvar alterações"
            submittingLabel="Salvando..."
          />
        </div>
      ) : (
        <Card>
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {company.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.logoUrl}
                  alt={`Logo de ${company.name}`}
                  className="size-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-semibold text-primary">
                  {initial}
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{company.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {maskDocument(company.document, company.personType)}
                </p>
                {!company.logoUrl ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Uma boa identidade visual ajuda clientes a reconhecerem sua loja.
                  </p>
                ) : null}
              </div>
            </div>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <Info label="E-mail comercial" value={company.businessEmail} />
              <Info label="Telefone" value={formatPhone(company.phone)} />
              <Info label="WhatsApp" value={company.whatsapp ? formatPhone(company.whatsapp) : "Não informado"} />
              <Info
                label="Endereço"
                value={`${company.street}, ${company.number}${
                  company.complement ? ` - ${company.complement}` : ""
                }`}
              />
              <Info label="Bairro" value={company.neighborhood} />
              <Info label="Cidade" value={`${company.city} - ${company.state}`} />
              <Info label="CEP" value={formatPostalCode(company.postalCode)} />
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="h-11" onClick={() => setIsLogoDialogOpen(true)}>
                {company.logoUrl ? "Trocar logo" : "Adicionar logo"}
              </Button>
              <Button variant="outline" className="h-11" onClick={() => setIsEditing(true)}>
                Editar dados
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <CompanyLogoDialog
        open={isLogoDialogOpen}
        onOpenChange={setIsLogoDialogOpen}
        companyId={company.id}
        companyName={company.name}
        currentLogoUrl={company.logoUrl}
        currentLogoPublicId={company.logoPublicId}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
