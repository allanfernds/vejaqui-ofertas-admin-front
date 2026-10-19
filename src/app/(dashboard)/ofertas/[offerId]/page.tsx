"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { OfferForm } from "@/components/offers/offer-form";
import { Skeleton } from "@/components/ui/skeleton";
import { parseMoney } from "@/lib/currency";
import { toDateTimeLocalValue } from "@/lib/date";
import { getErrorMessage } from "@/lib/api-error";
import { useCategories } from "@/hooks/use-categories";
import { useOffer, useUpdateProductOffer } from "@/hooks/use-offers";
import { useSelectedCompany } from "@/providers/company-provider";
import { toProductOfferPayload, type OfferFormValues } from "@/schemas/offer.schema";

export default function EditOfferPage() {
  const params = useParams<{ offerId: string }>();
  const router = useRouter();
  const { company } = useSelectedCompany();
  const categoriesQuery = useCategories();
  const offerQuery = useOffer(company?.id, params.offerId);
  const updateOffer = useUpdateProductOffer(company?.id ?? "", params.offerId);
  const offer = offerQuery.data;

  async function handleSubmit(values: OfferFormValues) {
    try {
      await updateOffer.mutateAsync(toProductOfferPayload(values));
      toast.success("Oferta atualizada com sucesso.");
      router.replace("/ofertas");
    } catch (error) {
      toast.error(getErrorMessage(error, "Não conseguimos salvar sua oferta. Tente novamente."));
    }
  }

  if (!company || offerQuery.isLoading || categoriesQuery.isLoading || !offer) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Editar oferta</h1>
        <p className="mt-2 text-muted-foreground">Altere os dados e publique novamente quando estiver pronto.</p>
      </div>
      <OfferForm
        categories={categoriesQuery.data ?? []}
        companyName={company.name}
        companyCity={company.city}
        companyState={company.state}
        defaultValues={{
          title: offer.product.title,
          categoryId: offer.product.categoryId,
          description: offer.product.description,
          images: offer.product.images.map((image) => ({
            url: image.url,
            publicId: image.publicId,
            altText: image.altText,
            position: image.position,
            isPrimary: image.isPrimary,
          })),
          originalPrice: parseMoney(offer.originalPrice),
          promotionalPrice: parseMoney(offer.promotionalPrice),
          installments: offer.installments,
          saleUrl: offer.saleUrl,
          deliveryAvailable: offer.deliveryAvailable,
          freeShipping: offer.freeShipping,
          shippingPrice: offer.shippingPrice == null ? null : parseMoney(offer.shippingPrice),
          deliveryInformation: offer.deliveryInformation ?? "",
          useCompanyLocation:
            offer.city === company.city && offer.state === company.state,
          city: offer.city,
          state: offer.state,
          startsAt: toDateTimeLocalValue(offer.startsAt),
          expiresAt: toDateTimeLocalValue(offer.expiresAt),
        }}
        onSubmit={handleSubmit}
        submitLabel="Salvar oferta"
        submittingLabel="Salvando..."
      />
    </div>
  );
}
