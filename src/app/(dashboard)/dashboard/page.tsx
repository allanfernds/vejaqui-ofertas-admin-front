"use client";

import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { OfferCard } from "@/components/offers/offer-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUiOfferStatus } from "@/lib/offer-status";
import { useOffers } from "@/hooks/use-offers";
import { useAuth } from "@/providers/auth-provider";
import { useSelectedCompany } from "@/providers/company-provider";

export default function DashboardPage() {
  const { user } = useAuth();
  const { company } = useSelectedCompany();
  const offersQuery = useOffers(company?.id, { page: 1, limit: 100 });
  const offers = offersQuery.data?.data ?? [];
  const firstName = user?.name.split(" ")[0] ?? "por aqui";

  const activeCount = offers.filter((offer) => getUiOfferStatus(offer) === "ACTIVE").length;
  const pausedCount = offers.filter((offer) => getUiOfferStatus(offer) === "PAUSED").length;
  const endedCount = offers.filter((offer) => getUiOfferStatus(offer) === "ENDED").length;
  const latestOffers = offers.slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Olá, {firstName}</h1>
          <p className="mt-2 text-muted-foreground">Vamos colocar suas ofertas em destaque?</p>
        </div>
        <Button render={<Link href="/ofertas/nova" />} className="h-11">
          + Criar oferta
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard title="Ofertas ativas" value={activeCount} loading={offersQuery.isLoading} />
        <SummaryCard title="Ofertas pausadas" value={pausedCount} loading={offersQuery.isLoading} />
        <SummaryCard title="Ofertas encerradas" value={endedCount} loading={offersQuery.isLoading} />
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Últimas ofertas</h2>
        {offersQuery.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : latestOffers.length === 0 ? (
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
            {latestOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  loading,
}: {
  title: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-8 w-12" /> : <p className="text-3xl font-semibold">{value}</p>}
      </CardContent>
    </Card>
  );
}
