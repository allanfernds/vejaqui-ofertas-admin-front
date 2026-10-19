"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { OfferForm } from "@/components/offers/offer-form";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api-error";
import { useCategories } from "@/hooks/use-categories";
import { useCreateOffer } from "@/hooks/use-offers";
import { useSelectedCompany } from "@/providers/company-provider";
import { toProductOfferPayload, type OfferFormValues } from "@/schemas/offer.schema";

export default function NewOfferPage() {
  const router = useRouter();
  const { company } = useSelectedCompany();
  const categoriesQuery = useCategories();
  const createOffer = useCreateOffer(company?.id ?? "");

  async function handleSubmit(values: OfferFormValues) {
    try {
      await createOffer.mutateAsync(toProductOfferPayload(values));
      toast.success("Oferta publicada com sucesso!");
      router.replace("/ofertas");
    } catch (error) {
      toast.error(getErrorMessage(error, "Não conseguimos publicar sua oferta. Tente novamente."));
    }
  }

  if (!company || categoriesQuery.isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Criar oferta</h1>
        <p className="mt-2 text-muted-foreground">
          Preencha as informações do jeito que seus clientes vão ver.
        </p>
      </div>
      <OfferForm
        categories={categoriesQuery.data ?? []}
        companyName={company.name}
        companyCity={company.city}
        companyState={company.state}
        onSubmit={handleSubmit}
        submitLabel="Publicar oferta"
        submittingLabel="Publicando oferta..."
      />
    </div>
  );
}
