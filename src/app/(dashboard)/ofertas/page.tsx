"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/feedback/empty-state";
import { OfferCard } from "@/components/offers/offer-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/api-error";
import { useDebounce } from "@/hooks/use-debounce";
import { useChangeOfferStatus, useOffers } from "@/hooks/use-offers";
import { useSelectedCompany } from "@/providers/company-provider";
import type { Offer, OfferListStatusFilter } from "@/types/offer";

const FILTERS: Array<{ id: OfferListStatusFilter; label: string }> = [
  { id: "ALL", label: "Todas" },
  { id: "ACTIVE", label: "Ativas" },
  { id: "PAUSED", label: "Pausadas" },
  { id: "ENDED", label: "Encerradas" },
];

export default function OffersPage() {
  const { company } = useSelectedCompany();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OfferListStatusFilter>("ALL");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 350);
  const query = {
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 12,
  };
  const offersQuery = useOffers(company?.id, query);
  const changeStatus = useChangeOfferStatus(company?.id ?? "");
  const offers = offersQuery.data?.data ?? [];
  const meta = offersQuery.data?.meta;

  async function handleToggle(offer: Offer) {
    try {
      await changeStatus.mutateAsync({
        offerId: offer.id,
        input: { status: offer.status === "ACTIVE" ? "PAUSED" : "ACTIVE" },
      });
      toast.success(offer.status === "ACTIVE" ? "Oferta pausada." : "Oferta ativada.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Não conseguimos atualizar o status da oferta."));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Suas ofertas</h1>
          <p className="mt-2 text-muted-foreground">Publique, edite ou pause quando quiser.</p>
        </div>
        <Button render={<Link href="/ofertas/nova" />} className="h-11">
          + Nova oferta
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Buscar oferta"
          aria-label="Buscar oferta"
          className="h-11 sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
          {FILTERS.map((filter) => (
            <Button
              key={filter.id}
              type="button"
              variant={status === filter.id ? "default" : "outline"}
              onClick={() => {
                setStatus(filter.id);
                setPage(1);
              }}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {offersQuery.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : offers.length === 0 ? (
        <EmptyState
          title="Você ainda não publicou nenhuma oferta."
          description="Publique sua primeira oferta e comece a alcançar clientes da sua região."
          action={
            <Button render={<Link href="/ofertas/nova" />} className="h-11">
              Publicar primeira oferta
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onToggleStatus={handleToggle}
              isUpdating={changeStatus.isPending}
            />
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 ? (
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Anterior
          </Button>
          <p className="text-sm text-muted-foreground">
            Página {meta.page} de {meta.totalPages}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Próxima
          </Button>
        </div>
      ) : null}
    </div>
  );
}
